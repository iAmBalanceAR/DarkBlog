'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/app/components/layout'
import Header from '@/app/components/header'
import { Footer } from '@/app/components/footer'
import { LoginForm } from '@/app/components/auth/login-form'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { Hero } from '@/app/components/hero'
export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/profile')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // Prevents flash of login form while redirecting
  }

  return (
    <>
    <Layout>
      <Header />
      <Hero />
        <div className="bg-white border-l-2 border-r-2 min-h-min flex items-center justify-center max-w-[1109px] mx-auto mt-4 mb-8 px-8">
            <LoginForm />
        </div>
      <Footer />
    </Layout>
    </>
  )
} 
