import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Server Configuration
export const PORT = process.env.PORT || 4000
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_DEVELOPMENT = NODE_ENV === 'development'

// Database Configuration
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsaround'

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

// Security Configuration
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
export const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)

// CORS Configuration
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [FRONTEND_URL]

// API Configuration
export const API_PREFIX = process.env.API_PREFIX || '/api'
export const API_VERSION = process.env.API_VERSION || 'v1'

// File Upload Configuration
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB
export const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif']

// Pagination Configuration
export const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE || '10', 10)
export const MAX_PAGE_SIZE = parseInt(process.env.MAX_PAGE_SIZE || '100', 10)

// Logging Configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

// Export all as config object for convenience
export const config = {
  // Server
  PORT,
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  
  // Database
  MONGODB_URI,
  
  // JWT
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  
  // Security
  BCRYPT_SALT_ROUNDS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  
  // CORS
  FRONTEND_URL,
  ALLOWED_ORIGINS,
  
  // API
  API_PREFIX,
  API_VERSION,
  
  // File Upload
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  
  // Pagination
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  
  // Logging
  LOG_LEVEL
}

export default config