'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/UI/button'
import Link from 'next/link'
import LoadingSpinner from '@/app/components/LoadingSpinner'

export default function ViewProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/admin/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user) return <div>Failed to load profile</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Profile Details</h1>
        <Link href="/admin/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">First Name</label>
              <p className="mt-1 text-lg text-gray-100">{user.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Last Name</label>
              <p className="mt-1 text-lg text-gray-100">{user.lastName}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <p className="mt-1 text-lg text-gray-100">{user.email}</p>
          </div>

          {user.profileImage && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Profile Image</label>
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="mt-2 w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}

          {user.socialLinks && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Social Links</h3>
              {Object.entries(user.socialLinks).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-400 capitalize">
                    {platform}
                  </label>
                  <a 
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-blue-400 hover:text-blue-300"
                  >
                    {url as string}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 