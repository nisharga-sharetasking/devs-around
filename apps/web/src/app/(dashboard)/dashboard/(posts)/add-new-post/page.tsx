import React from 'react'
import AddPostForm from './_components/AddPostForm'

const AddNewProductPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Add New Post</h1>
      <AddPostForm />
    </section>
  )
}

export default AddNewProductPage
