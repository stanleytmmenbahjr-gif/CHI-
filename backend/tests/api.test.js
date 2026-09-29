import assert from 'node:assert/strict'
import { once } from 'node:events'
import { after, before, test } from 'node:test'
import { MemoryStore } from 'express-rate-limit'
import app, { createApp } from '../app.js'
import { loadEnvironment } from '../utils/env.js'

let server
let baseUrl

before(async () => {
  server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
})

test('health endpoint returns structured JSON', async () => {
  const response = await fetch(`${baseUrl}/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true, status: 'ok' })
  assert.equal(response.headers.get('x-powered-by'), null)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.match(response.headers.get('permissions-policy'), /camera=\(\)/)
})

test('contact endpoint validates payloads and allows configured local origins', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      Origin: 'http://localhost:5174',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fullName: '', email: 'bad-email', category: 'Other' }),
  })

  const result = await response.json()
  assert.equal(response.status, 422)
  assert.equal(result.success, false)
  assert.equal(result.error.code, 'VALIDATION_ERROR')
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5174')
})

test('honeypot submissions are accepted without sending email', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Automated Sender',
      email: 'bot@example.com',
      phone: '',
      organization: '',
      category: 'General Inquiry',
      subject: 'Spam test',
      message: 'This submission filled the hidden spam field.',
      website: 'https://spam.example',
    }),
  })

  assert.equal(response.status, 200)
  assert.equal((await response.json()).success, true)
})

test('rejects unapproved browser origins', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: '', email: 'bad', category: 'Other' }),
  })

  assert.equal(response.status, 403)
  assert.equal((await response.json()).error.code, 'ORIGIN_NOT_ALLOWED')
})

test('rejects JSON request bodies larger than the configured limit', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(13 * 1024) }),
  })

  assert.equal(response.status, 413)
  assert.equal((await response.json()).error.code, 'PAYLOAD_TOO_LARGE')
})

test('enforces the contact limit across requests to one app instance', async () => {
  const isolatedServer = createApp({ rateLimitStore: new MemoryStore() }).listen(0, '127.0.0.1')
  await once(isolatedServer, 'listening')
  const isolatedUrl = `http://127.0.0.1:${isolatedServer.address().port}/api/contact`

  try {
    const statuses = []
    for (let index = 0; index < 6; index += 1) {
      const response = await fetch(isolatedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      statuses.push(response.status)
      await response.arrayBuffer()
    }
    assert.deepEqual(statuses.slice(0, 5), [422, 422, 422, 422, 422])
    assert.equal(statuses[5], 429)
  } finally {
    await new Promise((resolve, reject) => isolatedServer.close((error) => error ? reject(error) : resolve()))
  }
})

test('requires a shared Redis URL for production configuration', () => {
  assert.throws(() => loadEnvironment({
    strict: true,
    environment: {
      NODE_ENV: 'production',
      PORT: '3001',
      RESEND_API_KEY: 'test-key',
      RESEND_FROM_EMAIL: 'CHI <website@example.org>',
      CONTACT_EMAIL: 'info@example.org',
      CLIENT_ORIGINS: 'https://example.org',
      REDIS_URL: '',
    },
  }), /REDIS_URL is required/)
})

test('health and API logs never expose request content fields', async () => {
  const { logger } = await import('../utils/logger.js')
  const originalLog = console.log
  let loggedRecord = ''
  console.log = (record) => { loggedRecord = record }

  try {
    logger.info('test.redaction', {
      requestId: 'test-request',
      email: 'private@example.com',
      ip: '203.0.113.2',
      message: 'private request body',
    })
  } finally {
    console.log = originalLog
  }

  assert.match(loggedRecord, /test-request/)
  assert.doesNotMatch(loggedRecord, /private@example\.com|203\.0\.113\.2|private request body/)
})