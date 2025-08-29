import { Router } from 'express'
import type { Router as RouterType } from 'express'
import userRoutes from './users'
import authRoutes from '../modules/auth/routes'
import postRoutes from '../modules/posts/routes'

const route: RouterType = Router()

route.get('/', (_req, res) => {
  res.json({ 
    message: 'DevsAround Blog API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      users: '/api/users'
    }
  })
})

route.get('/health', (_req, res) => {
  res.json({ message: 'API health is OK mere vai' })
})

// API routes
route.use('/auth', authRoutes)
route.use('/posts', postRoutes)
route.use('/users', userRoutes)

export default route