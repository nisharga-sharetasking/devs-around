import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { connectDatabase } from './config/database'
import routes from './routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { ResponseHandler } from './utils/responseHandler'
import {
  PORT,
  NODE_ENV,
  FRONTEND_URL,
  ALLOWED_ORIGINS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  API_PREFIX
} from './config'

const app: Express = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : FRONTEND_URL,
  credentials: true
}))
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  handler: (_req, res) => {
    ResponseHandler.error(res, 'Too many requests, please try again later', 429)
  }
})
app.use(API_PREFIX, limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check route
app.get('/health', (_req, res) => {
  ResponseHandler.success(res, 'Server is healthy', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  })
})

// API routes
app.use(API_PREFIX, routes)

// 404 handler
app.use(notFoundHandler)

// Error handling middleware (must be last)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()
    
    app.listen(PORT, () => {
      console.log(`✅ API Server running on port ${PORT}`)
      console.log(`📍 Environment: ${NODE_ENV}`)
      console.log(`🔗 API Prefix: ${API_PREFIX}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...')
  console.error(err)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.error(err)
  process.exit(1)
})

startServer()

export default app