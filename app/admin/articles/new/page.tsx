'use client'

import { ArticleForm } from '@/app/components/admin/articles/article-form'
import { useRouter } from 'next/navigation'

export default function NewArticlePage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      console.log('Form data:', data)

      const formData = new FormData()
      
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key].toString())
          console.log(`Adding ${key}:`, data[key])
        }
      })

      console.log('Sending request...')

      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData
      })

      console.log('Response:', response)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Error response:', errorData)
        throw new Error(errorData || 'Failed to create article')
      }

      const result = await response.json()
      console.log('Success:', result)

      router.push('/admin/articles')
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to create article: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return <ArticleForm onSubmit={handleSubmit} />
} 