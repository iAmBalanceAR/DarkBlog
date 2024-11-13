'use client'

import { useState, useRef } from 'react'
import { Button } from '@/app/components/UI/button'
import { Input } from '@/app/components/UI/input'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface ProfileFormProps {
  initialData: {
    firstName: string
    lastName: string
    email: string
    profileImage?: string
    socialLinks?: {
      twitter?: string
      linkedin?: string
      github?: string
    }
  }
  onSaveComplete?: () => void
}

export function ProfileForm({ initialData, onSaveComplete }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialData)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const submitFormData = new FormData()
      submitFormData.append('file', file)
      submitFormData.append('type', 'profilepic')
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: submitFormData
        })
        
        const result = await response.json()
        if (result.url) {
          setFormData(prev => ({ ...prev, profileImage: result.url }))
        }
      } catch (error) {
        console.error('Upload error:', error)
        setErrorMessage('Failed to upload image')
        setShowErrorModal(true)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append('firstName', formData.firstName)
      submitFormData.append('lastName', formData.lastName)
      submitFormData.append('email', formData.email)
      submitFormData.append('socialLinks', JSON.stringify(formData.socialLinks))
      if (formData.profileImage) {
        submitFormData.append('profileImage', formData.profileImage)
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: submitFormData
      })

      if (!response.ok) throw new Error('Failed to update profile')

      if (onSaveComplete) {
        onSaveComplete()
      }
    } catch (err) {
      setErrorMessage('Failed to update profile')
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profile Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-700 file:text-gray-300
              hover:file:bg-gray-600
              cursor-pointer"
          />
          {formData.profileImage && (
            <div className="mt-4">
              <Image
                src={formData.profileImage}
                alt="Profile Preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Links</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter</label>
            <Input
              type="url"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, twitter: e.target.value }
              })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <Input
              type="url"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
              })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <Input
              type="url"
              value={formData.socialLinks?.github || ''}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, github: e.target.value }
              })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Error</h3>
            </div>
            <p className="text-gray-300 mb-4">{errorMessage}</p>
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowErrorModal(false)}
                size="sm"
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