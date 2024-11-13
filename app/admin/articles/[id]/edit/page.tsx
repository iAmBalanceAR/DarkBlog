'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ArticleForm from '@/app/components/admin/articles/article-form'
import { Loader2 } from 'lucide-react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default function EditArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/articles/${params?.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch article')
        }
        const data = await response.json()
        setArticle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article')
      } finally {
        setIsLoading(false)
      }
    }

    if (params?.id) {
      fetchArticle()
    }
  }, [params?.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900/10 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-100">Edit Article</h1>
        <p className="text-gray-400">Make changes to your article</p>
      </div>

      {article && (
        <ArticleForm 
          initialData={article}
          isEditing={true} onSubmit={function (data: any): Promise<void> {
            throw new Error('Function not implemented.')
          } }        />
      )}
    </div>
  )
} 