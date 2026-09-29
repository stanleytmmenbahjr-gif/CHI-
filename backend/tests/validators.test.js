import test from 'node:test'
import assert from 'node:assert/strict'
import { contactSchema } from '../utils/validators.js'
import { escapeHtml } from '../services/resend.service.js'

const validContact = {
  fullName: '  Amina Koroma  ',
  email: 'amina@example.com',
  phone: '',
  organization: 'CHI Community Group',
  category: 'General Inquiry',
  subject: '  Community program question  ',
  message: 'Hello, I would like to learn more.\r\nThank you.',
  website: '',
}

test('validates and sanitizes a contact submission', () => {
  const result = contactSchema.safeParse(validContact)
  assert.equal(result.success, true)
  assert.equal(result.data.fullName, 'Amina Koroma')
  assert.equal(result.data.subject, 'Community program question')
  assert.equal(result.data.message, 'Hello, I would like to learn more.\nThank you.')
})

test('rejects invalid email and unknown category', () => {
  const result = contactSchema.safeParse({ ...validContact, email: 'not-an-email', category: 'Other' })
  assert.equal(result.success, false)
})

test('rejects oversized message content', () => {
  const result = contactSchema.safeParse({ ...validContact, message: 'x'.repeat(5001) })
  assert.equal(result.success, false)
})

test('HTML email output escapes markup in user-controlled text', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
})