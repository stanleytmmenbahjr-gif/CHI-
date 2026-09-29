import { createApp } from './app.js'
import { connectRateLimitStore } from './services/redis.service.js'
import { loadEnvironment } from './utils/env.js'
import { logger } from './utils/logger.js'

let server
let redisConnection
let shuttingDown = false

try {
  const config = loadEnvironment({ strict: true })
  redisConnection = await connectRateLimitStore(config.redisUrl)
  const app = createApp({ rateLimitStore: redisConnection.store })

  server = app.listen(config.port, () => {
    logger.info('api.started', { port: config.port, stage: config.nodeEnv })
  })
  server.keepAliveTimeout = 5000
  server.headersTimeout = 10000
} catch (error) {
  logger.error('api.startup_failed', {
    code: 'STARTUP_CONFIGURATION_OR_DEPENDENCY_FAILED',
    reason: error instanceof Error ? error.message : 'Unknown startup error',
  })
  process.exit(1)
}

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true
  logger.info('api.shutdown_started', { stage: signal })

  const forceCloseTimer = setTimeout(() => {
    logger.error('api.shutdown_timeout', { code: 'FORCE_CLOSE' })
    server?.closeAllConnections?.()
  }, 10000)
  forceCloseTimer.unref()

  if (server) await new Promise((resolve) => server.close(() => resolve()))

  try {
    await redisConnection?.close()
  } catch {
    logger.error('api.redis_shutdown_failed', { code: 'REDIS_CLOSE_FAILED' })
    exitCode = 1
  }

  clearTimeout(forceCloseTimer)
  process.exitCode = exitCode
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))
process.once('uncaughtException', () => shutdown('UNCAUGHT_EXCEPTION', 1))
process.once('unhandledRejection', () => shutdown('UNHANDLED_REJECTION', 1))