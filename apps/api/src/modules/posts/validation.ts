import { body, query, param, ValidationChain } from 'express-validator'

export const createPostValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Excerpt cannot exceed 300 characters'),
  
  body('coverImageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Cover image must be a valid URL'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom((tags: string[]) => tags.every(tag => typeof tag === 'string')).withMessage('All tags must be strings'),
  
  body('publishedAt')
    .optional()
    .isISO8601().withMessage('Published date must be a valid ISO date')
]

export const updatePostValidation: ValidationChain[] = [
  param('id')
    .isMongoId().withMessage('Invalid post ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Excerpt cannot exceed 300 characters'),
  
  body('coverImageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Cover image must be a valid URL'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('publishedAt')
    .optional()
    .isISO8601().withMessage('Published date must be a valid ISO date')
]

export const getPostsValidation: ValidationChain[] = [
  query('search')
    .optional()
    .trim()
    .isString().withMessage('Search must be a string'),
  
  query('tag')
    .optional()
    .trim()
    .isString().withMessage('Tag must be a string'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
]

export const getPostBySlugValidation: ValidationChain[] = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format')
]

export const deletePostValidation: ValidationChain[] = [
  param('id')
    .isMongoId().withMessage('Invalid post ID')
]