import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { AppError } from '../middleware/errorHandler'

export class UserController {
  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select('-password')
      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.id).select('-password')
      
      if (!user) {
        return next(new AppError('User not found', 404))
      }
      
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body
      
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return next(new AppError('User already exists', 400))
      }
      
      const user = new User({ name, email, passwordHash: password, role })
      await user.save()
      
      const userResponse = user.toObject()
      delete (userResponse as any).passwordHash
      
      res.status(201).json(userResponse)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password')
      
      if (!user) {
        return next(new AppError('User not found', 404))
      }
      
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      
      if (!user) {
        return next(new AppError('User not found', 404))
      }
      
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}