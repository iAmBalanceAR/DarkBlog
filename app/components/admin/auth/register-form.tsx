'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/UI/input'
import { Button } from '@/app/components/UI/button'
import Link from 'next/link'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('firstName', firstName)
      formData.append('lastName', lastName)
      formData.append('role', 'ADMIN')

      const res = await fetch('/api/admin/auth/register', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Registration failed')

      router.push('/admin/login')
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-800 rounded-sm shadow-lg border-2 border-blue-500 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-100">Create Account</h1>
          <p className="text-gray-400">Register for an admin account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">First Name</label>
              <div className="relative">
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-gray-100 focus:ring-gray-700 focus:border-gray-600"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Last Name</label>
              <div className="relative">
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-gray-100 focus:ring-gray-700 focus:border-gray-600"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Email Address</label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-700"
                placeholder="you@example.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Password</label>
            <div className="relative">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-700"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/admin/login" 
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}