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
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    
    const result = await postService.getPublicPosts({
      search: req.query.search as string,
      tag: req.query.tag as string,
      page: page > 0 ? page : 1,
      limit: limit > 0 && limit <= 100 ? limit : 10
    })

    ResponseHandler.success(
      res,
      'Posts fetched successfully',
      { posts: result.posts },
      200,
      {
        page: result.currentPage,
        limit: limit > 0 && limit <= 100 ? limit : 10,
        total: result.total,
        totalPages: result.totalPages
      }
    )
  })

  getPostBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const post = await postService.getPostBySlug(req.params.slug)

    ResponseHandler.success(res, 'Post fetched successfully', { post })
  })

  getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const post = await postService.getPostById(req.params.id)

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