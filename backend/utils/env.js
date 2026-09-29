import 'dotenv/config'
import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  RESEND_API_KEY: z.string().trim().default(''),
  RESEND_FROM_EMAIL: z.string().trim().default(''),
  CONTACT_EMAIL: z.string().trim().default(''),
  CLIENT_ORIGINS: z.string().trim().default(''),
  REDIS_URL: z.string().trim().default(''),
})

function parseAllowedOrigins(value) {
  const origins = value.split(',').map((origin) => origin.trim()).filter(Boolean)
  for (const origin of origins) {
    let parsed
    try {
      parsed = new URL(origin)
    } catch {
      throw new Error('CLIENT_ORIGINS must contain valid origin URLs')
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error('CLIENT_ORIGINS entries must be exact http(s) origins without paths or wildcards')
    }
  }
  return origins
}

function emailFromHeader(value) {
  const bracketed = value.match(/<([^<>]+)>/)
  return bracketed ? bracketed[1].trim() : value
}

export function loadEnvironment({ strict = false, environment = process.env } = {}) {
  const parsed = environmentSchema.safeParse(environment)
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`)
  }

  const config = parsed.data
  const clientOrigins = parseAllowedOrigins(config.CLIENT_ORIGINS)

  if (config.REDIS_URL) {
    let redisUrl
    try {
      redisUrl = new URL(config.REDIS_URL)
    } catch {
      throw new Error('REDIS_URL must be a valid Redis connection URL')
    }
    if (!['redis:', 'rediss:'].includes(redisUrl.protocol)) {
      throw new Error('REDIS_URL must use redis:// or rediss://')
    }
  }

  if (config.CONTACT_EMAIL && !z.string().email().safeParse(config.CONTACT_EMAIL).success) {
    throw new Error('CONTACT_EMAIL must be a valid email address')
  }

  if (config.RESEND_FROM_EMAIL) {
    const senderEmail = emailFromHeader(config.RESEND_FROM_EMAIL)
    if (!z.string().email().safeParse(senderEmail).success) {
      throw new Error('RESEND_FROM_EMAIL must contain a valid sender email address')
    }
  }

  if (strict) {
    const missing = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'CONTACT_EMAIL']
      .filter((name) => !config[name])
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    if (config.NODE_ENV === 'production' && !clientOrigins.length) {
      throw new Error('CLIENT_ORIGINS must list at least one exact frontend origin in production')
    }
    if (config.NODE_ENV === 'production' && !config.REDIS_URL) {
      throw new Error('REDIS_URL is required in production for shared rate limiting')
    }
  }

  return Object.freeze({
    nodeEnv: config.NODE_ENV,
    port: config.PORT,
    resendApiKey: config.RESEND_API_KEY,
    resendFromEmail: config.RESEND_FROM_EMAIL,
    contactEmail: config.CONTACT_EMAIL,
    clientOrigins,
    redisUrl: config.REDIS_URL,
    isProduction: config.NODE_ENV === 'production',
  })
}