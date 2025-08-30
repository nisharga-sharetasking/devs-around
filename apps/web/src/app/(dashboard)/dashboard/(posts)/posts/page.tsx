'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import GlobalLoader from '@/components/shared/global-loader'
import { PostsTable } from './_components/posts-table'
import { useGetMyPostsQuery } from '@/redux/api-queries/posts'

const PostPage = () => {
  // === fetch posts ===
  const { data, isLoading, isFetching } = useGetMyPostsQuery({})
  const posts = data?.data?.posts
  console.log('🚀 ~ PostPage ~ posts:', posts)

  if (isLoading) return <GlobalLoader />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-medium text-2xl">All Posts ({posts?.length})</h1>

        <div className="flex gap-2">
          {/* add new */}
          <Button asChild className="ms-auto">
            <Link href="/dashboard/add-new-post">Add New Post</Link>
          </Button>
        </div>
      </div>

      {/* table */}
      <PostsTable products={posts} isLoading={isLoading} isFetching={isFetching} page={1} />
    </div>
  )
}

export default PostPage
