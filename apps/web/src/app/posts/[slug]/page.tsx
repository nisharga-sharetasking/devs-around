'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/shared/container'
import { useGetPostQuery } from '@/redux/api-queries/posts'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, UserIcon, ArrowLeftIcon, ClockIcon } from 'lucide-react'

const PostDetailsPage = () => {
  const params = useParams()
  const slug = params?.slug as string

  const { data, isLoading, error } = useGetPostQuery({ id: slug })
  const post = data?.data?.post

  if (isLoading) {
    return <PostDetailsSkeleton />
  }

  if (error || !post) {
    return (
      <div className="min-h-screen w-full bg-secondary">
        <Header />
        <Container className="py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-8">
              The post you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  const postDate = post.publishedAt || post.createdAt
  console.log('🚀 ~ postDate:', postDate)
  const formattedDate = formatDistanceToNow(new Date(postDate), { addSuffix: true })
  const readingTime = Math.ceil(post.content.split(' ').length / 200)

  return (
    <div className="min-h-screen w-full bg-secondary">
      <Header />

      <article className="w-full">
        <div className="bg-background border-b">
          <Container className="py-8">
            <Button asChild variant="ghost" className="mb-6 -ml-2">
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>

            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post?.title}</h1>

              <p className="text-xl text-muted-foreground mb-6">{post?.excerpt}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={post?.authorId?.avatar || '/no_image.png'}
                      alt={post?.authorId?.name}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{post?.authorId?.name}</p>
                    <p className="text-xs">{post?.authorId?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={postDate}>{formattedDate}</time>
                </div>

                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {post?.tags && post?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post?.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </div>

        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            {post?.coverImageUrl && (
              <div className="relative w-full h-96 md:h-[500px] mb-12 rounded-lg overflow-hidden">
                <Image
                  src={post?.coverImageUrl}
                  alt={`Cover image for ${post?.title}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Container>
      </article>
    </div>
  )
}

const PostDetailsSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-secondary">
      <Header />
      <div className="bg-background border-b">
        <Container className="py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-6" />
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </Container>
      </div>
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full mb-12 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </Container>
    </div>
  )
}

const Header = () => {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <Container className="py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">
          DevsAround
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/register"
            className="px-4 py-2 text-foreground hover:text-primary transition-colors"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Login
          </Link>
        </nav>
      </Container>
    </header>
  )
}

export default PostDetailsPage
