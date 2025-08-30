import { Post, IPost } from '../../models/Post'
import { Types } from 'mongoose'
import { NotFoundError, ConflictError, ForbiddenError, BadRequestError } from '../../utils/customError'

interface CreatePostData {
  title: string
  content: string
  slug?: string
  excerpt?: string
  coverImageUrl?: string
  tags?: string[]
  authorId: string
  publishedAt?: Date | null
}

interface UpdatePostData {
  title?: string
  content?: string
  slug?: string
  excerpt?: string
  coverImageUrl?: string
  tags?: string[]
  publishedAt?: Date | null
}

interface GetPostsQuery {
  search?: string
  tag?: string
  page?: number
  limit?: number
}

interface PostsResponse {
  posts: IPost[]
  totalPages: number
  currentPage: number
  total: number
}

export class PostService {
  async createPost(data: CreatePostData): Promise<IPost> {
    // Check if slug already exists
    if (data.slug) {
      const existingPost = await Post.findOne({ slug: data.slug })
      if (existingPost) {
        throw new ConflictError('A post with this slug already exists')
      }
    }

    const post = new Post({
      ...data,
      authorId: new Types.ObjectId(data.authorId)
    })

    await post.save()
    await post.populate('authorId', 'name email')

    return post
  }

  async updatePost(id: string, authorId: string, data: UpdatePostData): Promise<IPost> {
    const post = await Post.findById(id)
    
    if (!post) {
      throw new NotFoundError('Post not found')
    }

    // Check ownership
    if (post.authorId.toString() !== authorId) {
      throw new ForbiddenError('You are not authorized to update this post')
    }

    // Check if new slug already exists
    if (data.slug && data.slug !== post.slug) {
      const existingPost = await Post.findOne({ slug: data.slug })
      if (existingPost) {
        throw new ConflictError('A post with this slug already exists')
      }
    }

    Object.assign(post, data)
    await post.save()
    await post.populate('authorId', 'name email')

    return post
  }

  async deletePost(id: string, authorId: string): Promise<void> {
    const post = await Post.findById(id)
    
    if (!post) {
      throw new NotFoundError('Post not found')
    }

    // Check ownership
    if (post.authorId.toString() !== authorId) {
      throw new ForbiddenError('You are not authorized to delete this post')
    }

    await post.deleteOne()
  }

  async getPublicPosts(query: GetPostsQuery): Promise<PostsResponse> {
    const { search, tag, page = 1, limit = 10 } = query
    
    // Build query - show all posts for now (in production, you may want to filter by publishedAt)
    const filter: any = {}
    
    if (search) {
      // Use regex for search if text index is not available
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] }
    }

    // Get total count
    const total = await Post.countDocuments(filter)
    
    // Get paginated posts
    const posts = await Post.find(filter)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 }) // Sort by creation date instead
      .skip((page - 1) * limit)
      .limit(limit)

    return {
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  }

  async getPostBySlug(slug: string): Promise<IPost> {
    const post = await Post.findOne({ 
      slug
      // Remove publishedAt filter to show all posts during development
    }).populate('authorId', 'name email')

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    return post
  }

  async getPostById(id: string): Promise<IPost> {
    const post = await Post.findById(id).populate('authorId', 'name email')

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    return post
  }

  async getUserPosts(authorId: string): Promise<IPost[]> {
    const posts = await Post.find({ authorId: new Types.ObjectId(authorId) })
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })

    return posts
  }

  async seedPosts(authorId: string): Promise<void> {
    try {
      // Check if user already has posts
      const existingCount = await Post.countDocuments({ authorId: new Types.ObjectId(authorId) })
      if (existingCount > 0) {
        throw new ConflictError('User already has posts. Delete existing posts before seeding.')
      }

      // Fetch sample posts from JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      if (!response.ok) {
        throw new Error('Failed to fetch sample posts')
      }
      
      const samplePosts = await response.json() as any[]
      const createdPosts = []

      for (let i = 0; i < samplePosts.length; i++) {
        const samplePost = samplePosts[i]
        
        // Generate unique slug with timestamp
        const baseSlug = samplePost.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 40)
        
        const uniqueSlug = `${baseSlug}-${Date.now()}-${i}`

        const post = new Post({
          title: samplePost.title,
          content: samplePost.body + '\n\nThis is a sample post generated for demonstration purposes. ' +
                   'You can edit or delete this post as needed.',
          slug: uniqueSlug,
          excerpt: samplePost.body.substring(0, 200) + '...',
          tags: ['sample', 'demo', 'blog', `category-${(i % 3) + 1}`],
          authorId: new Types.ObjectId(authorId),
          publishedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Stagger publish dates
          coverImageUrl: `https://picsum.photos/800/400?random=${Date.now() + i}`
        })

        const savedPost = await post.save()
        createdPosts.push(savedPost)
      }

      console.log(`Successfully seeded ${createdPosts.length} posts for user ${authorId}`)
    } catch (error) {
      console.error('Error seeding posts:', error)
      if (error instanceof ConflictError) {
        throw error
      }
      throw new BadRequestError('Failed to seed posts. Please try again.')
    }
  }
}