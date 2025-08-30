import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  callback: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
}

export function useInfiniteScroll({
  callback,
  hasMore,
  isLoading,
  threshold = 100
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            callback()
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      )
      
      if (node) observerRef.current.observe(node)
    },
    [callback, hasMore, isLoading, threshold]
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return lastElementRef
}