import dotenv from 'dotenv'
import { connectDB, disconnectDB } from '../config/database'
import { User } from '../models/User'

dotenv.config()

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@devsaround.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
  },
]

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...')
    
    await connectDB()
    
    await User.deleteMany({})
    console.log('Cleared existing users')
    
    const users = await User.insertMany(seedUsers)
    console.log(`Inserted ${users.length} users`)
    
    console.log('Database seeding completed successfully')
  } catch (error) {
    console.error('Database seeding failed:', error)
    process.exit(1)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

seedDatabase()