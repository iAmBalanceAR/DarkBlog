'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/app/components/LoadingSpinner'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        if (status === 'loading') return
        
        if (!session) {
          throw new Error('Not authenticated')
        }

        const res = await fetch('/api/admin/profile')
        if (!res.ok) {
          throw new Error('Not authorized')
        }

        setIsAuthed(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.replace('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [session, status, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!isAuthed) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-100">Dashboard</h1>
        <p className="text-gray-400">Welcome to your content management dashboard</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <p className="text-gray-300">
          Use the sidebar menu to manage your articles, categories, and other content.
        </p>
      </div>
    </div>
  )
} 