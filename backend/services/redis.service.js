import { createClient } from 'redis'
import { RedisStore } from 'rate-limit-redis'
import { logger } from '../utils/logger.js'

export async function connectRateLimitStore(redisUrl) {
  if (!redisUrl) return { store: undefined, close: async () => {} }

  const client = createClient({ url: redisUrl, socket: { connectTimeout: 5000 } })
  client.on('error', () => logger.error('redis.client_error'))

  try {
    await client.connect()
  } catch {
    throw new Error('Could not connect to the configured Redis service')
  }

  const store = new RedisStore({
    prefix: 'chi:contact:rate-limit:',
    sendCommand: (...args) => client.sendCommand(args),
  })

  return {
    store,
    close: async () => {
      if (client.isOpen) await client.quit()
    },
  }
}