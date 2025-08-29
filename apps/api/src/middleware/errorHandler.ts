import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/customError'
import { ResponseHandler } from '../utils/responseHandler'
import mongoose from 'mongoose'

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500
  let message = 'Internal server error'
  let errorDetails = undefined

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  }

  // Handle different error types
  if (err instanceof CustomError || err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422
    message = 'Validation failed'
    errorDetails = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }))
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `${field} already exists`
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token has expired'
  } else if (err.message) {
    message = err.message
  }

  // Send error response
  ResponseHandler.error(res, message, statusCode, errorDetails)
}

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`)
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}