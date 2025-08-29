import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema, ZodIssue } from 'zod'
import { ResponseHandler } from '../utils/responseHandler'

export const validate = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        ResponseHandler.validationError(res, errors)
        return
      }
      next(error)
    }
  }
}

// Helper function to validate just the body
export const validateBody = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        ResponseHandler.validationError(res, errors)
        return
      }
      next(error)
    }
  }
}

// Helper function to validate query parameters
export const validateQuery = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        ResponseHandler.validationError(res, errors)
        return
      }
      next(error)
    }
  }
}

// Helper function to validate route parameters
export const validateParams = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        ResponseHandler.validationError(res, errors)
        return
      }
      next(error)
    }
  }
}