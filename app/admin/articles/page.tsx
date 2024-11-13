'use client'

import { useState, useEffect, Suspense } from 'react'
import { Plus, Search, Calendar, CheckCircle, Trash2, Pencil, Check } from 'lucide-react'
import { Button } from '@/app/components/UI/button'
import { Input } from '@/app/components/UI/input'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import LoadingSpinner from '@/app/components/LoadingSpinner'

interface Article {
  id: string
  title: string
  category: {
    name: string
  }
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
  scheduledFor: string | null
  publishedAt: string | null
  isFeatured: boolean
  updatedAt: string
}

const statusConfig = {
  PUBLISHED: { color: 'bg-green-400', label: 'Published' },
  SCHEDULED: { color: 'bg-blue-400', label: 'Scheduled' },
  DRAFT: { color: 'bg-red-400', label: 'Draft' }
}

// Create a separate component for the articles content
function ArticlesContent() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/articles')
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch articles')
        }

        const data = await response.json()
        console.log('Fetched articles:', data)
        setArticles(data)

      } catch (err) {
        console.error('Error details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load articles')
      } finally {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])
  useEffect(() => {
    if (searchParams?.get('success') === 'true') {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const getStatusColor = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig].color
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const initiateDelete = async (id: string) => {
    setSelectedArticle(id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedArticle) return

    try {
      const response = await fetch(`/api/admin/articles/${selectedArticle}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete article')

      setArticles(articles.filter(article => article.id !== selectedArticle))
      setShowDeleteModal(false)
      setMessage('Article deleted successfully')
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null)
      }, 3000)

    } catch (error) {
      setMessage('Failed to delete article')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  return (
    <div>
      {message && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-500">{message}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 p-4 bg-green-900/10 border border-green-900/20 rounded-lg flex items-center gap-3 text-green-400 shadow-lg animate-fade-in-out">
          <CheckCircle className="w-5 h-5" />
          Article created successfully!
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-100">Articles</h1>
          <p className="text-gray-400">Manage and organize your content</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-sm text-gray-300">{config.label}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/articles/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Article
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
              />
            </div>
            <div className="flex gap-4">
              <select 
                className="flex-1 px-3 py-2 rounded-md bg-gray-700 border-gray-600 text-gray-100"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 text-red-400 bg-red-900/10">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="text-left p-4 font-medium text-gray-400">Title</th>
                  <th className="text-left p-4 font-medium text-gray-400">Category</th>
                  <th className="text-center p-4 font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 font-medium text-gray-400">Date</th>
                  <th className="text-center p-4 font-medium text-gray-400">Featured</th>
                  <th className="text-right p-4 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                    <td className="p-4">
                      <Link href={`/admin/articles/${article.id}`} className="text-blue-400 hover:underline font-medium">
                        {article.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        Last edited {formatDate(article.updatedAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                        {article.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <span className={`inline-block w-4 h-4 rounded-full ${getStatusColor(article.status)}`} />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {article.status === 'SCHEDULED' 
                          ? formatDate(article.scheduledFor)
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        {article.isFeatured && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-200 hover:text-green-200 hover:bg-green-300/20"
                        >
                          <Pencil className='w-4 h-4' />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          initiateDelete(article.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Main page component
export default function ArticlesPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  )
} 