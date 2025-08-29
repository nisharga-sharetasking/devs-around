import { Response } from 'express'

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
  error?: any
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    meta?: any
  ): Response {
    const response: ApiResponse<T> = {
      status: 'success',
      message,
      data
    }

    if (meta) {
      response.meta = meta
    }

    return res.status(statusCode).json(response)
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: any
  ): Response {
    const response: ApiResponse = {
      status: 'error',
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }

    return res.status(statusCode).json(response)
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201)
  }

  static badRequest(res: Response, message: string, error?: any): Response {
    return this.error(res, message, 400, error)
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401)
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403)
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404)
  }

  static conflict(res: Response, message: string): Response {
    return this.error(res, message, 409)
  }

  static validationError(res: Response, errors: any): Response {
    return this.error(res, 'Validation failed', 422, errors)
  }

  static serverError(res: Response, message: string = 'Internal server error', error?: any): Response {
    return this.error(res, message, 500, error)
  }
}