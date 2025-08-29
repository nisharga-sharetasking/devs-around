import { Router } from 'express'
import type { Router as RouterType } from 'express'
import { PostController } from './controller'
import {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
  getPostBySlugSchema,
  updatePostParamsSchema,
  deletePostSchema
} from './schemas'
import { validateBody, validateQuery, validateParams } from '../../middleware/validation'
import { authenticate } from '../../middleware/auth'

const router: RouterType = Router()
const postController = new PostController()

// Public routes
router.get('/', validateQuery(getPostsQuerySchema), postController.getPosts)
router.get('/:slug', validateParams(getPostBySlugSchema), postController.getPostBySlug)

// Protected routes
router.post('/', authenticate, validateBody(createPostSchema), postController.createPost)
router.patch(
  '/:id',
  authenticate,
  validateParams(updatePostParamsSchema),
  validateBody(updatePostSchema),
  postController.updatePost
)
router.delete('/:id', authenticate, validateParams(deletePostSchema), postController.deletePost)

// User specific routes
router.get('/my/posts', authenticate, postController.getMyPosts)
router.post('/seed', authenticate, postController.seedPosts)

export default router