import { Request, Response } from 'express'

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
  err: Error | AppError,
  _req: Request,
  res: Response) => {
  let statusCode = 500
  let message = 'Internal Server Error'
  
  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  }
  
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}