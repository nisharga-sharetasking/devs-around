import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsaround'
    
    await mongoose.connect(mongoUri)
    
    console.log('MongoDB connected successfully')
    
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB disconnected')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  }
}