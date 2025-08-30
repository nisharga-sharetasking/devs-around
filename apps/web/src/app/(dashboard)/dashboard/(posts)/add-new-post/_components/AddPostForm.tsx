/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EditorToolbar } from '@/components/tiptap/editor-toolbar'
import { useCreatePostMutation } from '@/redux/api-queries/posts'
import { useRouter } from 'next/navigation'
import { ImageUploadInputWithImgBB } from './image-upload-input'

const AddPostForm = () => {
  const router = useRouter()

  const [currentTag, setCurrentTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<string>('')

  const [formData, setFormData] = useState<any>({
    title: '',
    content: '',
    slug: '',
    excerpt: '',
    coverImageUrl: '',
    tags: [] as string[],
  })

  const [createPost, { isLoading }] = useCreatePostMutation()

  // Editor for post content
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setFormData((prev: any) => ({ ...prev, content: html }))
    },
  })

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const updated = [...tags, currentTag.trim()]
      setTags(updated)
      handleInputChange('tags', updated)
      setCurrentTag('')
    }
  }

  const removeTag = (index: number) => {
    const updated = [...tags]
    updated.splice(index, 1)
    setTags(updated)
    handleInputChange('tags', updated)
  }

  const handleCreate = async () => {
    // === Basic Validation ===
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required')
      return
    }
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required')
      return
    }
    if (!coverImage) {
      toast.error('Cover image is required')
      return
    }

    const payload = {
      ...formData,
      coverImageUrl: coverImage,
    }

    try {
      const response = await createPost({ payload }).unwrap()
      if (response.status === 'success') {
        toast.success('Post created successfully!')
        router.replace('/dashboard/posts')
      }
    } catch (error: any) {
      console.error('Post creation error:', error)
      toast.error(error?.data?.message || 'Failed to create post')
    }
  }

  return (
    <div>
      <Card>
        <CardContent className="space-y-6">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., my-new-blog-post"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Enter a short summary..."
            />
          </div>

          {/* Content (Tiptap Editor) */}
          <div className="space-y-2">
            <label htmlFor="content" className="block font-medium">
              Content *
            </label>
            {editor && <EditorToolbar editor={editor} />}
            <div className="border p-4 rounded-lg">
              <EditorContent editor={editor} className="prose max-w-none" />
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image *</Label>
            <ImageUploadInputWithImgBB
              inputId="cover-image-upload"
              defaultValue={coverImage ? [coverImage] : []}
              onChange={(images) => {
                const img = images[0] || ''
                setCoverImage(img)
              }}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} size="icon">
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="cursor-pointer hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <Button onClick={handleCreate} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddPostForm
