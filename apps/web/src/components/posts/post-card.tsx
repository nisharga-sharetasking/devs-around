'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, UserIcon } from 'lucide-react'

interface Author {
  _id: string
  name: string
  email: string
  avatar?: string
}

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  tags: string[]
  authorId: Author
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postDate = post.publishedAt || post.createdAt
  const formattedDate = formatDistanceToNow(new Date(postDate), { addSuffix: true })

  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      <Link
        href={`/posts/${post._id}`}
        className="flex flex-col h-full focus:outline-none"
        aria-label={`Read post: ${post.title}`}
      >
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl || '/no_image.png'}
              alt={`Cover image for ${post.title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </CardHeader>

        <CardContent className="flex-grow pb-3">
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3" role="list" aria-label="Post tags">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs" role="listitem">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post?.authorId?.avatar} alt={post?.authorId?.name} />
                <AvatarFallback>
                  <UserIcon className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground truncate max-w-[150px]">
                {post?.authorId?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarIcon className="h-3 w-3" aria-hidden="true" />
              <time dateTime={postDate}>{formattedDate}</time>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default PostCard
