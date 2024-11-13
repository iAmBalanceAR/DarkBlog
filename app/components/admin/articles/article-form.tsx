'use client'

import { useState } from 'react'
import { Button } from '@/app/components/UI/button'
import { Input } from '@/app/components/UI/input'
import { Calendar, Save, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'

const RichTextEditor = dynamic(() => import('@/app/components/editor'), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-800 animate-pulse rounded-md" />
})

interface Category {
  id: string
  name: string
}

interface ArticleFormProps {
  initialData?: {
    id?: string
    title: string
    slug: string
    blurb: string
    content: string
    categoryId: string
    headerImage: string
    isFeatured: boolean
    articleStatus: string
    scheduledFor?: string
    previewToken?: string
  }
  onSubmit: (data: any) => Promise<void>
  onError?: (error: Error) => void
  isEditing?: boolean
}

export default function ArticleForm({ initialData, onSubmit, onError, isEditing = false }: ArticleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        scheduledFor: initialData.scheduledFor 
          ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
          : '',
      }
    }
    return {
      title: '',
      slug: '',
      blurb: '',
      content: '',
      categoryId: '',
      headerImage: '',
      isFeatured: false,
      articleStatus: 'DRAFT',
      scheduledFor: ''
    }
  })

  const [showSchedule, setShowSchedule] = useState(formData.articleStatus === 'SCHEDULED')
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    }
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const form = new FormData()
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value.toString())
        }
      })

      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing 
        ? `/api/admin/articles/${initialData?.id}` 
        : '/api/admin/articles'

      const response = await fetch(url, {
        method,
        body: form
      })

      if (!response.ok) {
        throw new Error('Failed to save article')
      }

      setSuccessMessage(`Article ${isEditing ? 'updated' : 'created'} successfully`)
      setShowSuccess(true)
      
      localStorage.setItem('articleMessage', `Article ${isEditing ? 'updated' : 'created'} successfully`)
      
      setTimeout(() => {
        router.push('/admin/articles')
        router.refresh()
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save article')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-4 text-green-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-xl font-semibold">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-1 text-gray-100">Article Details</h2>
          <p className="text-gray-400 text-sm">Basic information about your article</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                  })
                }}
                placeholder="Enter article title"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-friendly-title"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Blurb</label>
            <textarea
              rows={3}
              value={formData.blurb}
              onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              placeholder="Brief description of the article"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Header Image</label>
              <div className="flex gap-4 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0]
                      const formData = new FormData()
                      formData.append('image', file)

                      try {
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        })

                        if (!response.ok) {
                          const error = await response.json()
                          throw new Error(error.error || 'Upload failed')
                        }
                        const data = await response.json()
                        setFormData(prev => ({ ...prev, headerImage: data.url }))
                      } catch (error) {
                        console.error('Upload error:', error)
                        setError(error instanceof Error ? error.message : 'Failed to upload image')
                      }
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-gray-100 file:bg-gray-600 file:text-gray-100 file:border-0 file:px-4 file:py-2 file:mr-4 file:hover:bg-gray-500 cursor-pointer"
                />
                {formData.headerImage && (
                  <img
                    src={formData.headerImage}
                    alt="Header preview"
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-1 text-gray-100">Publishing Settings</h2>
          <p className="text-gray-400 text-sm">Control when and how your article is published</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Status</label>
              <select 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.articleStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
                  setFormData({ ...formData, articleStatus: newStatus })
                  setShowSchedule(newStatus === 'SCHEDULED')
                }}
              >
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {showSchedule && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">Schedule Publication</label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                   required
                    className="pl-10 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Feature this article
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-1 text-gray-100">Article Content</h2>
          <p className="text-gray-400 text-sm">Write your article content here</p>
        </div>
        <div className="p-6">
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>
        </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Article
              </>
            )}
          </Button>

          <Button 
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 border-red-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form> 
  )
} 

export { ArticleForm }