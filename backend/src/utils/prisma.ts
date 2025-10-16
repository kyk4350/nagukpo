import { PrismaClient } from '@prisma/client'
import logger from './logger'

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' }
  ]
})

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    logger.debug(`Query: ${e.query}`)
    logger.debug(`Duration: ${e.duration}ms`)
  })
}

// Log errors
prisma.$on('error' as never, (e: any) => {
  logger.error(`Prisma Error: ${e.message}`)
})

// Log warnings
prisma.$on('warn' as never, (e: any) => {
  logger.warn(`Prisma Warning: ${e.message}`)
})

/**
 * Connect to database with retry logic
 * @param retries - Number of retry attempts
 * @param delay - Delay between retries in ms
 */
export async function connectDatabase(retries = 5, delay = 5000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect()
      logger.info('Database connected successfully')
      return
    } catch (error) {
      logger.error(`Database connection attempt ${i + 1} failed:`, error)

      if (i === retries - 1) {
        logger.error('Max database connection retries reached')
        throw error
      }

      logger.info(`Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
  logger.info('Database disconnected')
}

export default prisma
