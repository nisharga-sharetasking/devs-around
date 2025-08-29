import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ResponseHandler } from '../utils/responseHandler'
import { JWT_SECRET } from '../config'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      ResponseHandler.unauthorized(res, 'Authentication required')
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = decoded.userId

    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      ResponseHandler.unauthorized(res, 'Token has expired')
      return
    }
    ResponseHandler.unauthorized(res, 'Invalid token')
  }
}

export const authorize = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Authentication required' })
        return
      }

      // Fetch user role from database if needed
      // For now, we'll assume it's set by authenticate middleware
      if (!roles.includes(req.userRole || '')) {
        res.status(403).json({ error: 'Insufficient permissions' })
        return
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}