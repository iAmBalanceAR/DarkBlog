'use client'

import { useRouter } from 'next/navigation'
import { CategoryForm } from '@/app/components/admin/categories/category-form'
import { useState } from 'react'
import { SuccessModal } from '@/app/components/UI/success-modal'

export default function NewCategoryPage() {
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

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to create category')

      setSuccessMessage('Category created successfully')
      setShowSuccess(true)
      
      // Navigate after the modal has been shown for a moment
      setTimeout(() => {
        router.push('/admin/categories')
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Create New Category</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <CategoryForm onSubmit={handleSubmit} />
      </div>

      {showSuccess && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  )
} 