'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Plus, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  inputId: string
  defaultValue?: string[]
  onChange?: (urls: string[]) => void
  className?: string
  imgClass?: string
}

export const ImageUploadInputWithImgBB = ({
  inputId,
  defaultValue = [],
  onChange,
  className,
  imgClass,
}: Props) => {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValue)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setLoading(true)
    const uploaded: string[] = []

    for (const file of files) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 3MB.`)
        continue
      }

      const formData = new FormData()
      formData.append('image', file)

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_FILE_UPLOAD_API_KEY}`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const data = await res.json()

        if (data?.success) {
          uploaded.push(data.data.url)
        } else {
          toast.error(`Failed to upload: ${file.name}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Upload failed.')
      }
    }

    const newImages = [...imageUrls, ...uploaded]
    setImageUrls(newImages)
    onChange?.(newImages)
    setLoading(false)
  }

  const handleRemove = (index: number) => {
    const updated = [...imageUrls]
    updated.splice(index, 1)
    setImageUrls(updated)
    onChange?.(updated)
  }

  // 🔁 Sync state if defaultValue changes
  useEffect(() => {
    setImageUrls(defaultValue)
  }, [defaultValue])

  return (
    <div
      className={cn('relative flex flex-col gap-4 rounded-lg border border-input p-4', className)}
    >
      <div
        onClick={() => !loading && document.getElementById(inputId)?.click()}
        className="flex items-center justify-center gap-4 w-full cursor-pointer"
      >
        <div className="size-10 rounded-md grid place-items-center bg-secondary">
          <Plus size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {loading ? 'Uploading...' : 'Click to upload'}
          </span>
          <span className="text-xs text-muted-foreground">
            Supported: .png, .jpg, .webp (Max: 3MB)
          </span>
        </div>
      </div>

      {imageUrls?.length > 0 && (
        <div className="w-full space-y-2 flex flex-wrap gap-4">
          {imageUrls?.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 bg-secondary p-2 rounded-md"
            >
              <Image
                src={url ?? ''}
                alt={`Uploaded-${index}`}
                width={400}
                height={100}
                className={cn('h-[100px] w-full rounded-md', imgClass)}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="hover:text-destructive"
                onClick={() => handleRemove(index)}
              >
                <XCircle />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Input
        id={inputId}
        type="file"
        className="hidden"
        accept="image/webp,image/jpeg,image/png"
        multiple
        onChange={handleUpload}
      />
    </div>
  )
}
