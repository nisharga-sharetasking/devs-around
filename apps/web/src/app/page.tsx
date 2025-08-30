/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/shared/container'
import SearchBar from '@/components/posts/search-bar'
import PostsGrid from '@/components/posts/posts-grid'
import { Loader2 } from 'lucide-react'
import { useGetAllPostsQuery } from '@/redux/api-queries/posts'
import { useRef } from 'react'

interface InfiniteScrollProps {
  callback: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
}

function useInfiniteScroll({ callback, hasMore, isLoading, threshold = 200 }: InfiniteScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            callback()
          }
        },
        { rootMargin: `${threshold}px` }
      )

      if (node) observer.current.observe(node)
    },
    [callback, hasMore, isLoading, threshold]
  )

  return lastElementRef
}

const POSTS_PER_PAGE = 6

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [allPosts, setAllPosts] = useState<any[]>([])

  const { data, isFetching, isLoading } = useGetAllPostsQuery({
    title: searchQuery,
    page: page.toString(),
    limit: POSTS_PER_PAGE.toString(),
  })

  const hasMore = data?.data?.posts?.length === POSTS_PER_PAGE

  // ✅ merge new posts
  useEffect(() => {
    if (data?.data?.posts) {
      if (page === 1) {
        setAllPosts(data.data.posts)
      } else {
        setAllPosts((prev) => [...prev, ...data.data.posts])
      }
    }
  }, [data, page])

  // ✅ reset on new search
  useEffect(() => {
    setPage(1)
    setAllPosts([])
  }, [searchQuery])

  // ✅ load more handler
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1)
    }
  }, [isFetching, hasMore])

  // ✅ attach infinite scroll
  const lastPostElementRef = useInfiniteScroll({
    callback: loadMore,
    hasMore,
    isLoading: isFetching,
    threshold: 200,
  })

  return (
    <div className="min-h-screen w-full bg-secondary">
      <Header />

      <main className="w-full">
        <section className="py-12 bg-background border-b">
          <Container>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Discover Amazing Posts</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore our collection of articles, tutorials, and insights from developers around
                the world
              </p>
            </div>
            <div className="mt-8">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search posts by title..."
                autoFocus
              />
            </div>
          </Container>
        </section>

        <section className="py-12">
          <Container>
            <PostsGrid posts={allPosts} isLoading={isLoading && page === 1} />

            {/* 👇 Infinite scroll trigger */}
            {allPosts?.length > 0 && hasMore && (
              <div 
                ref={lastPostElementRef}
                className="flex justify-center mt-8"
              >
                {isFetching && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more posts...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && allPosts.length > 0 && (
              <div className="text-center mt-8 text-muted-foreground">
                You have reached the end of the posts
              </div>
            )}
          </Container>
        </section>
      </main>
    </div>
  )
}

export default HomePage

const Header = () => {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <Container className="py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">DevsAround</h1>
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
