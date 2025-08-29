import { Request, Response } from 'express'
import { AuthService } from './service'
import { ResponseHandler } from '../../utils/responseHandler'
import { asyncHandler } from '../../middleware/errorHandler'

const authService = new AuthService()

export class AuthController {
  signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, token } = await authService.signup(req.body)
    ResponseHandler.created(res, 'User created successfully', { user, token })
  })

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user, token } = await authService.login(req.body)
    ResponseHandler.success(res, 'Login successful', { user, token })
  })

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).userId
    const user = await authService.getMe(userId)

    ResponseHandler.success(res, 'User fetched successfully', { user })
  })

  logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    // For JWT-based auth, logout is handled client-side
    // If using sessions, you would destroy the session here
    ResponseHandler.success(res, 'Logout successful')
  })
}