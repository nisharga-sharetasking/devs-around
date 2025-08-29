import { Router } from 'express'
import type { Router as RouterType } from 'express'
import userRoutes from './users'

const route: RouterType = Router()

route.get('/', (_req, res) => {
  res.json({ message: 'API is running' })
})
route.get('/health', (_req, res) => {
  res.json({ message: 'API health is OK mere vai' })
})

route.use('/users', userRoutes)

export default route