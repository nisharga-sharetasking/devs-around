/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EditorToolbar } from '@/components/tiptap/editor-toolbar'
import { useGetPostQuery, useUpdatePostMutation } from '@/redux/api-queries/posts'
import { IPost } from '../../../posts/_components/posts-table'
import { ImageUploadInputWithImgBB } from '../../../add-new-post/_components/image-upload-input'

const PostUpdateForm = () => {
  const router = useRouter()
  const { id } = useParams() // postId from URL
  const postId = id as string

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

  const { data, isLoading: isFetching } = useGetPostQuery({ id: postId })

  const [formData, setFormData] = useState<IPost | any>(null)
  const [originalData, setOriginalData] = useState<IPost | null>(null)

  const [currentTag, setCurrentTag] = useState('')
  const [coverImage, setCoverImage] = useState<string>('')

  // === Editor ===
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData?.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      handleInputChange('content', html)
    },
  })

  // Handle input change
  const handleInputChange = (field: keyof IPost, value: any) => {
    setFormData((prev: any) => (prev ? { ...prev, [field]: value } : prev))
  }

  // Load initial data
  useEffect(() => {
    if (data?.data) {
      setFormData(data.data)
      setOriginalData(data.data)
      setCoverImage(data.data.coverImageUrl || '')
    }
  }, [data])

  useEffect(() => {
    if (editor && formData?.content) {
      editor.commands.setContent(formData.content)
    }
  }, [editor, formData?.content])

  // === Tags handling ===
  const addTag = () => {
    if (!currentTag.trim()) return
    if (!formData?.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()])
    }
    setCurrentTag('')
  }
  const removeTag = (index: number) => {
    const updated = [...formData.tags]
    updated.splice(index, 1)
    handleInputChange('tags', updated)
  }

  // === Diff checker for payload ===
  const getUpdatedFields = () => {
    const updatedFields: Partial<IPost> = {}
    if (!formData || !originalData) return updatedFields

    for (const key in formData) {
      const formValue = (formData as any)[key]
      const originalValue = (originalData as any)[key]
      if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
        updatedFields[key as keyof IPost] = formValue
      }
    }

    if (coverImage !== originalData?.coverImageUrl) {
      updatedFields.coverImageUrl = coverImage
    }

    return updatedFields
  }

  // === Submit update ===
  const handleUpdate = async () => {
    if (!formData) return

    const payload = getUpdatedFields()
    if (Object.keys(payload).length === 0) {
      toast.info('No changes detected.')
      return
    }

    try {
      await updatePost({ id: postId, payload }).unwrap()
      toast.success('Post updated successfully!')
      router.replace('/dashboard/posts')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Update failed')
      console.error('Update error:', error)
    }
  }

  if (isFetching || !formData)
    return (
      <div className="w-fit mx-auto py-4">
        <Loader className="size-5 animate-spin" />
      </div>
    )

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* Title + Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label>Excerpt *</Label>
          <Input
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label>Content *</Label>
          {editor && <EditorToolbar editor={editor} />}
          <div className="border rounded p-4">
            <EditorContent editor={editor} className="prose" />
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label>Cover Image *</Label>
          <ImageUploadInputWithImgBB
            inputId="cover-image-upload"
            defaultValue={coverImage ? [coverImage] : []}
            onChange={(urls) => setCoverImage(urls[0] || '')}
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
            {formData.tags.map((tag: string, index: number) => (
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

        {/* Update Button */}
        <Button onClick={handleUpdate} disabled={isUpdating} className="w-full block">
          {isUpdating ? 'Updating...' : 'Update Post'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default PostUpdateForm
