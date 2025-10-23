import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cron from 'node-cron'
import dotenv from 'dotenv'
import logger from './utils/logger'
import { connectDatabase, disconnectDatabase } from './utils/prisma'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware'
import authRoutes from './routes/auth.routes'
import problemRoutes from './routes/problem.routes'
import chatRoutes from './routes/chat.routes'
import { authMiddleware } from './middleware/auth.middleware'
import { getProgressController, getStatsController } from './controllers/progress.controller'
import authService from './services/auth.service'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API info
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: '나국포 API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      health: '/health'
    }
  })
})

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemRoutes)
app.use('/api/v1/chat', chatRoutes)
app.get('/api/v1/progress', authMiddleware, getProgressController)
app.get('/api/v1/stats', authMiddleware, getStatsController)

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(errorHandler)

// Cron job: Clean up expired tokens every day at 3 AM
cron.schedule('0 3 * * *', async () => {
  logger.info('Running scheduled cleanup of expired tokens')
  try {
    await authService.cleanupExpiredTokens()
    logger.info('Expired tokens cleaned up successfully')
  } catch (error) {
    logger.error('Failed to cleanup expired tokens:', error)
  }
})

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase()

    // Start listening
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`API URL: http://localhost:${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...')
  await disconnectDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...')
  await disconnectDatabase()
  process.exit(0)
})

// Start
startServer()
