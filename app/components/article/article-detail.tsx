'use client'

import { ArticleHeader } from "@/app/components/article-header"
import { ArticleContent } from "@/app/components/article-content"
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/app/components/LoadingSpinner'

interface Article {
  id: string
  title: string
  content: string
  slug: string
  headerImage: string
  blurb: string
  category: {
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
  articleStatus: string
  categoryId: string
  scheduledFor: string | null
  publishedAt: string | null
  isFeatured: boolean
}

interface ArticleDetailProps {
  title: string,
  slug: string
  article: Article
}

export function ArticleDetail({ slug }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}`)
        if (!response.ok) throw new Error('Failed to fetch article')
        const data = await response.json()
        setArticle(data)
      } catch (error) {
        setError('Failed to load article')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !article) {
    return <div className="max-w-[1109px] mx-auto px-4 py-12">Article not found</div>
  }

  // Only show published articles
  if (article.articleStatus !== 'PUBLISHED') {
    return <div className="max-w-[1109px] mx-auto pl-4 py-0">Article not available</div>
  }

  return (
    <article className="max-w-[1109px] mx-auto pl-0 py-0">
      <ArticleHeader 
        title={article.title}
        category={article.category.name}
        date={new Date(article.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        image={article.headerImage || '/images/default-header.jpg'} article={ArticleContent.arguments  }/>
      <ArticleContent 
        title={article.title}
        category={article.category.name}
        date={new Date(article.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        image={article.headerImage || '/images/default-header.jpg'}
        article={{
          ...article,
          scheduledFor: article.scheduledFor ? new Date(article.scheduledFor) : null,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null
        }}
      />
    </article>
  )
} 