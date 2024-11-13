'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArticleForm } from '@/app/components/admin/articles/article-form'
import LoadingSpinner from '@/app/components/LoadingSpinner'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter()
  const [article, setArticle] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const resolvedParams = React.use(params)

  React.useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/articles/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch article')
        const data = await response.json()
        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [resolvedParams.id])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/articles/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update article')

      router.push('/admin/articles')
    } catch (error) {
      console.error('Error updating article:', error)
      throw error
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner size="large" />
    </div>
  )
  if (!article) return <div>Article not found</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Article</h1>
      </div>

      <div className=" bg-black rounded-lg shadow-sm border border-gray-200 p-6">
        <ArticleForm 
          initialData={article}
          onSubmit={handleSubmit}
          isEditing
        />
      </div>
    </div>
  )
} 