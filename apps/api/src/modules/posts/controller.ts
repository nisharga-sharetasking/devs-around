import { Request, Response } from 'express'
import { PostService } from './service'
import { AuthRequest } from '../../middleware/auth'
import { ResponseHandler } from '../../utils/responseHandler'
import { asyncHandler } from '../../middleware/errorHandler'

const postService = new PostService()

export class PostController {
  createPost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const post = await postService.createPost({
      ...req.body,
      authorId: req.userId!
    })

    ResponseHandler.created(res, 'Post created successfully', { post })
  })

  updatePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const post = await postService.updatePost(
      req.params.id,
      req.userId!,
      req.body
    )

    ResponseHandler.success(res, 'Post updated successfully', { post })
  })

  deletePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    await postService.deletePost(req.params.id, req.userId!)

    ResponseHandler.success(res, 'Post deleted successfully')
  })

  getPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await postService.getPublicPosts({
      search: req.query.search as string,
      tag: req.query.tag as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10
    })

    ResponseHandler.success(
      res,
      'Posts fetched successfully',
      { posts: result.posts },
      200,
      {
        page: result.currentPage,
        limit: result.posts.length,
        total: result.total,
        totalPages: result.totalPages
      }
    )
  })

  getPostBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const post = await postService.getPostBySlug(req.params.slug)

    ResponseHandler.success(res, 'Post fetched successfully', { post })
  })

  getMyPosts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const posts = await postService.getUserPosts(req.userId!)

    ResponseHandler.success(res, 'Posts fetched successfully', { posts })
  })

  seedPosts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    await postService.seedPosts(req.userId!)

    ResponseHandler.success(res, 'Posts seeded successfully')
  })
}