import { Router } from 'express'
import userRoutes from './users'

const route = Router()

route.get('/', (_req, res) => {
  res.json({ message: 'API is running' })
})

route.use('/users', userRoutes)

export default route