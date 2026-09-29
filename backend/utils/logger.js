import { randomUUID } from 'node:crypto'

const safeFieldNames = new Set(['requestId', 'method', 'path', 'statusCode', 'durationMs', 'port', 'stage', 'providerStatus', 'code', 'errorName', 'errorType', 'reason'])

function write(level, event, fields = {}) {
  const safeFields = Object.fromEntries(
    Object.entries(fields).filter(([name, value]) => safeFieldNames.has(name) && value !== undefined),
  )
  const record = JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...safeFields })
  const output = level === 'error' ? console.error : console.log
  output(record)
}

export const logger = Object.freeze({
  info: (event, fields) => write('info', event, fields),
  warn: (event, fields) => write('warn', event, fields),
  error: (event, fields) => write('error', event, fields),
})

export function requestLogger(request, response, next) {
  const requestId = randomUUID()
  const startedAt = process.hrtime.bigint()

  request.requestId = requestId
  response.setHeader('X-Request-Id', requestId)
  response.once('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000
    const fields = {
      requestId,
      method: request.method,
      path: request.path,
      statusCode: response.statusCode,
      durationMs: Math.round(durationMs),
    }
    if (response.statusCode >= 500) logger.error('http.request', fields)
    else if (response.statusCode >= 400) logger.warn('http.request', fields)
    else logger.info('http.request', fields)
  })
  next()
}