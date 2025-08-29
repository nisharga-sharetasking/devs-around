import { z } from 'zod'
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../config'

// MongoDB ObjectId validation
const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')

// Slug validation
const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .min(1, 'Slug is required')
  .max(200, 'Slug cannot exceed 200 characters')

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .trim(),
  
  slug: slugSchema.optional(),
  
  excerpt: z
    .string()
    .max(300, 'Excerpt cannot exceed 300 characters')
    .trim()
    .optional(),
  
  coverImageUrl: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .or(z.literal('')),
  
  tags: z
    .array(
      z.string().toLowerCase().trim().min(1, 'Tag cannot be empty')
    )
    .max(10, 'Cannot have more than 10 tags')
    .default([])
    .optional(),
  
  publishedAt: z
    .string()
    .datetime('Published date must be a valid ISO date')
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
  
  status: z
    .enum(['draft', 'published', 'archived'])
    .default('draft')
    .optional()
})

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
  
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .trim()
    .optional(),
  
  slug: slugSchema.optional(),
  
  excerpt: z
    .string()
    .max(300, 'Excerpt cannot exceed 300 characters')
    .trim()
    .optional(),
  
  coverImageUrl: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .or(z.literal('')),
  
  tags: z
    .array(
      z.string().toLowerCase().trim().min(1, 'Tag cannot be empty')
    )
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
  
  publishedAt: z
    .string()
    .datetime('Published date must be a valid ISO date')
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
  
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional()
})

export const getPostsQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional(),
  
  tag: z
    .string()
    .toLowerCase()
    .trim()
    .optional(),
  
  author: mongoIdSchema.optional(),
  
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional(),
  
  page: z
    .string()
    .optional()
    .default('1')
    .transform(val => parseInt(val, 10))
    .pipe(z.number().positive('Page must be a positive number')),
  
  limit: z
    .string()
    .optional()
    .default(String(DEFAULT_PAGE_SIZE))
    .transform(val => parseInt(val, 10))
    .pipe(
      z.number()
        .positive('Limit must be a positive number')
        .max(MAX_PAGE_SIZE, `Limit cannot exceed ${MAX_PAGE_SIZE}`)
    ),
  
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'publishedAt', 'title'])
    .default('publishedAt')
    .optional(),
  
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
})

export const getPostBySlugSchema = z.object({
  slug: slugSchema
})

export const getPostByIdSchema = z.object({
  id: mongoIdSchema
})

export const deletePostSchema = z.object({
  id: mongoIdSchema
})

export const updatePostParamsSchema = z.object({
  id: mongoIdSchema
})

// Comment schemas (for future use)
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .trim(),
  
  parentId: mongoIdSchema.optional().nullable()
})

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .trim()
})

// Type exports
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>
export type GetPostBySlugParams = z.infer<typeof getPostBySlugSchema>
export type GetPostByIdParams = z.infer<typeof getPostByIdSchema>
export type DeletePostParams = z.infer<typeof deletePostSchema>
export type UpdatePostParams = z.infer<typeof updatePostParamsSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>