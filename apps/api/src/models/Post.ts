import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl?: string
  tags: string[]
  authorId: Types.ObjectId
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters']
    },
    coverImageUrl: {
      type: String,
      default: ''
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Create text index for search
postSchema.index({ title: 'text', content: 'text', tags: 'text' })
// slug already has unique index from schema definition
postSchema.index({ authorId: 1 })
postSchema.index({ publishedAt: -1 })

// Auto-generate excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
  }
  next()
})

// Auto-generate slug from title if not provided
postSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

export const Post = mongoose.model<IPost>('Post', postSchema)