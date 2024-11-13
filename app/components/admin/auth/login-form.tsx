'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/UI/input'
import { Button } from '@/app/components/UI/button'
import Link from 'next/link'
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin'
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      if (result?.ok) {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-800 rounded-sm shadow-lg border-2 border-blue-500 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-100">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your admin account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <LogIn className="w-4 h-4" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/admin/register" 
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
          >
            Need an account? Register here
          </Link>
        </div>
      </div>
    </div>
  )
} 