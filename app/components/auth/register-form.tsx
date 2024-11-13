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
      <div className="bg-gray-100 rounded-lg shadow-lg border border-gray-500 p-">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 mt-4 text-slate-900">Create Account</h1>
          <p className="text-slate-800 text-lg font-semibold">Register for an admin account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-gray-800 grid grid-cols-2 gap-4 pl-4 pr-4">
            <div>
              <label className="ml-4 lock text-sm font-medium mb-2 text-slate-900">* First Name</label>
              <div className="relative ml-4">
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="focus:text-slate-900 pl-10 w-44 text-slate-500  bg-gray-100 border-gray-700 focus:ring-gray-700 focus:border-gray-600"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className='pl-0 pr-4'>
              <label className="text-slate-900 pl-4 pr-4 lock text-sm font-medium mb-2">* Last Name</label>
              <div className="pl-2 relative">
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="focus:text-slate-900 mt-1 w-44 text-slate-500  bg-slate-200 border-gray-700 focus:ring-gray-700 focus:border-gray-600"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="ml-7 text-slate-800 block text-sm font-medium mb-0">* Email Address</label>
            <div className="ml-7 relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8 w-96 focus:text-slate-900 bg-slate-200 border-gray-700 text-slate-500 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-700"
                placeholder="you@example.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            </div>
          </div>

          <div>
            <label className="ml-7 text-gray-800 block text-sm font-medium mb-2">* Password</label>
            <div className="ml-7 relative">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:text-slate-900 pl-10 w-96 bg-slate-200 border-gray-700 text-slate-500 placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-700"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-96 flex m-auto items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700" 
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