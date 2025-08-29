import { Router } from 'express'
import type { Router as RouterType } from 'express'
import { UserController } from '../controllers/userController'

const router: RouterType = Router()
const userController = new UserController()

router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router