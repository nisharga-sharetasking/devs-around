import { Router } from 'express'
import type { Router as RouterType } from 'express'
import { AuthController } from './controller'
import { signupSchema, loginSchema } from './schemas'
import { validateBody } from '../../middleware/validation'
import { authenticate } from '../../middleware/auth'

const router: RouterType = Router()
const authController = new AuthController()

router.post('/signup', validateBody(signupSchema), authController.signup)
router.post('/login', validateBody(loginSchema), authController.login)
router.get('/me', authenticate, authController.getMe)
router.post('/logout', authenticate, authController.logout)

export default router