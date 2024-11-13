'use client'

import { useRouter } from 'next/navigation'
import { CategoryForm } from './category-form'
import { useState } from 'react'
import { SuccessModal } from '@/app/components/UI/success-modal'

interface CategoryFormWrapperProps {
  categoryId: string
  initialData: {
    name: string
    slug: string
    description: string | null
    image: string | null
  }
}

export function CategoryFormWrapper({ categoryId, initialData }: CategoryFormWrapperProps) {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('slug', data.slug)
      formData.append('description', data.description || '')
      formData.append('image', data.image || '')

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to update category')

      setSuccessMessage('Category updated successfully')
      setShowSuccess(true)
      
      // Navigate after the modal has been shown for a moment
      setTimeout(() => {
        router.push('/admin/categories')
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  return (
    <>
      <CategoryForm onSubmit={handleSubmit} initialData={initialData} />
      
      {showSuccess && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  )
} 