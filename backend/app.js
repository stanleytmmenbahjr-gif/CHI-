import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import contactRoutes from './routes/contact.routes.js'
import { createContactRateLimiter } from './middleware/rateLimiter.js'
import { loadEnvironment } from './utils/env.js'
import { logger, requestLogger } from './utils/logger.js'

export function createApp({ rateLimitStore } = {}) {
  const config = loadEnvironment()
  const app = express()
  const configuredOrigins = new Set(config.clientOrigins)

  app.disable('x-powered-by')
  app.set('trust proxy', config.isProduction ? 1 : false)
  app.use(helmet({
    hsts: config.isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'no-referrer' },
  }))
  app.use((_request, response, next) => {
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
    next()
  })
  app.use(compression())
  app.use(requestLogger)
  app.use(cors({
    origin(origin, callback) {
      const localDevelopmentOrigin = !config.isProduction
        && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '')

      if (!origin || configuredOrigins.has(origin) || localDevelopmentOrigin) {
        callback(null, true)
        return
      }

      const error = new Error('Origin is not allowed')
      error.code = 'CORS_ORIGIN_DENIED'
      callback(error)
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    optionsSuccessStatus: 204,
    maxAge: 600,
  }))
  app.use(express.json({ limit: '12kb', strict: true }))

  app.get('/health', (_request, response) => {
    response.set('Cache-Control', 'no-store')
    response.json({ success: true, status: 'ok' })
  })

  app.use('/api/contact', contactRoutes(createContactRateLimiter(rateLimitStore)))

  app.use((_request, response) => {
    response.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'The requested endpoint was not found.' },
    })
  })

  app.use((error, request, response, _next) => {
    if (response.headersSent) return

    if (error.code === 'CORS_ORIGIN_DENIED') {
      response.status(403).json({
        success: false,
        error: { code: 'ORIGIN_NOT_ALLOWED', message: 'This website is not allowed to submit the form.' },
      })
      return
    }

    if (error.type === 'entity.parse.failed' || error.status === 400) {
      response.status(400).json({
        success: false,
        error: { code: 'INVALID_JSON', message: 'The request body must contain valid JSON.' },
      })
      return
    }

    if (error.type === 'entity.too.large') {
      response.status(413).json({
        success: false,
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'The submitted message is too large.' },
      })
      return
    }

    logger.error('api.request_failed', {
      requestId: request.requestId,
      code: 'INTERNAL_ERROR',
      errorName: error?.name,
      errorType: error?.type,
    })
    response.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred. Please try again.' },
    })
  })

  return app
}

const app = createApp()
export default app