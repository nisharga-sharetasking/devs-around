import React from 'react'
import PostUpdateForm from './_components/update-post'

const UpdateProductPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Update Post</h1>
      <PostUpdateForm />
    </section>
  )
}

export default UpdateProductPage
