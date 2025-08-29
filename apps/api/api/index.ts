import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDB } from '../src/config/database'
import routes from '../src/routes'
import { errorHandler } from '../src/middleware/errorHandler'

dotenv.config()

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', limiter)

app.use('/api', routes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/', (req, res) => {
  res.json({ message: 'DevsAround API is running on Vercel' })
})

app.use(errorHandler)

// Connect to database on cold start
let dbConnected = false
const ensureDbConnection = async () => {
  if (!dbConnected) {
    await connectDB()
    dbConnected = true
  }
}

// Wrap the app for serverless
export default async (req: any, res: any) => {
  await ensureDbConnection()
  app(req, res)
}