import winston from 'winston'

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`
  })
)

const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat
    })
  ]
})

export default logger
