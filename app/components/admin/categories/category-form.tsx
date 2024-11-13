'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/app/components/UI/input'
import { Button } from '@/app/components/UI/button'
import { Textarea } from '@/app/components/UI/textarea'
import { useEffect, useState } from 'react'

interface CategoryFormData {
  name: string
  slug: string
  description: string | null
  image?: string | null
}

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>
  initialData?: CategoryFormData
}

export function CategoryForm({ onSubmit, initialData }: CategoryFormProps) {
  console.log('Form initialData:', initialData)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CategoryFormData>({
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      image: null
    }
  })

  const [imagePreview, setImagePreview] = useState(() => {
    console.log('Setting initial image preview:', initialData?.image)
    return initialData?.image || ''
  })

  const name = watch('name')

  useEffect(() => {
    if (!initialData) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [name, setValue, initialData])

  const [uploadError, setUploadError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('Upload error:', data.error)
          setUploadError(data.error)
          return
        }

        console.log('Upload response:', data)
        setValue('image', data.url)
        setImagePreview(data.url)
        setUploadError('')
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError('Failed to upload image. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Name</label>
        <Input
          {...register('name', { required: true })}
          className="w-full bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
          placeholder="Category name"
        />
        {errors.name && <span className="text-sm text-red-500">This field is required</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Slug</label>
        <Input
          {...register('slug', { required: true })}
          className="w-full bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
          placeholder="category-slug"
        />
        {errors.slug && <span className="text-sm text-red-500">This field is required</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Description</label>
        <Textarea
          {...register('description')}
          className="w-full bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
          placeholder="Category description"
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-200">Category Image</label>
          <p className="text-xs text-gray-400 mt-1">Recommended: 1920x1080px, max 4MB</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 w-full bg-gray-900 border-gray-700 text-gray-100 file:bg-gray-800 file:text-gray-100 file:border-0 file:px-4 file:py-2 file:mr-4 file:hover:bg-gray-700 cursor-pointer"
          />
          {uploadError && (
            <p className="mt-2 text-sm text-red-400">{uploadError}</p>
          )}
        </div>

        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-200 mb-2">Preview</p>
            <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] rounded-lg overflow-hidden bg-gray-900">
              <img
                src={imagePreview}
                alt="Category preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  )
} 