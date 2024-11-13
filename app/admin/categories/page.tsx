'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/UI/button'
import { Input } from '@/app/components/UI/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LoadingSpinner from '@/app/components/LoadingSpinner'


interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Article {
  id: string
  title: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [attachedArticles, setAttachedArticles] = useState<Article[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const message = localStorage.getItem('categoryMessage')
    if (message) {
      setMessage(message)
      localStorage.removeItem('categoryMessage')
      
      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleEdit = (id: string) => {
    router.push(`/admin/categories/edit/${id}`)
  }

  const initiateDelete = async (id: string) => {
    setSelectedCategory(id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.articles) {
          setAttachedArticles(data.articles)
          setShowDeleteModal(false)
          setShowErrorModal(true)
          return
        }
        throw new Error('Failed to delete category')
      }

      setCategories(categories.filter(cat => cat.id !== selectedCategory))
      setShowDeleteModal(false)
      toast.success('Category deleted')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Something went wrong')
    }
  } 
  
  return ( 
  <>
      <div>
        {message && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-500">{message}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Link href="/admin/categories/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Category
            </Button>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
              />
            </div>
          </div>
          {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            <LoadingSpinner size="large" />
          </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="text-left p-4 font-medium text-gray-300">Name</th>
                  <th className="text-left p-4 font-medium text-gray-300">Slug</th>
                  <th className="text-left p-4 font-medium text-gray-300">Description</th>
                  <th className="text-right p-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>             
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-gray-700">
                    <td className="p-4 font-medium text-gray-100">{category.name}</td>
                    <td className="p-4 text-gray-400">{category.slug}</td>
                    <td className="p-4 text-gray-400">{category.description || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-700 p-2"
                          onClick={() => handleEdit(category.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-700 p-2 text-red-400 hover:text-red-300"
                          onClick={() => initiateDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
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

      {/* Error Modal - Shows Articles Using Category */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-xl w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-amber-400 w-5 h-5" />
              <h3 className="text-xl font-semibold text-gray-100">Cannot Delete Category</h3>
            </div>
            <p className="text-gray-300 mb-4">
              This category cannot be deleted because it is currently assigned to the following articles:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {attachedArticles.map((article) => (
                  <li key={article.id}>{article.title}</li>
                ))}
              </ul>
            </div>
            <p className="text-gray-300 mb-6">
              Please reassign these articles to different categories before deleting this category.
            </p>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 