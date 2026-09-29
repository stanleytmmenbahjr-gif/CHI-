import { rateLimit } from 'express-rate-limit'

export function createContactRateLimiter(store) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    store,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many messages were sent from this connection. Please try again in 15 minutes.',
      },
    },
  })
}