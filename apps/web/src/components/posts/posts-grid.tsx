/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import PostCard from './post-card'
import { Skeleton } from '@/components/ui/skeleton'

interface PostsGridProps {
  posts: any[]
  isLoading?: boolean
  skeletonCount?: number
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, isLoading = false, skeletonCount = 6 }) => {
  if (isLoading && posts.length === 0) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-label="Loading posts"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No posts found</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="feed"
      aria-label="Posts list"
    >
      {posts.map((post, index) => (
        <article key={index} role="article">
          <PostCard post={post} />
        </article>
      ))}
    </div>
  )
}

const PostSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex justify-between pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export default PostsGrid
