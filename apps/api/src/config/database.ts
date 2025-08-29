import mongoose from 'mongoose'
import { MONGODB_URI } from '../config'

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false)
    
    const conn = await mongoose.connect(MONGODB_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  }
}

// Keep aliases for backward compatibility
export const connectDB = connectDatabase
export const disconnectDB = disconnectDatabase