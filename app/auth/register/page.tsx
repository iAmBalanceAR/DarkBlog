'use client'

import { RegisterForm } from '@/app/components/auth/register-form'
import Header from '@/app/components/header'
import { Hero } from '@/app/components/hero'
import { Footer } from '@/app/components/footer'
import Layout from '@/app/components/layout'
export default function AuthRegisterPage() {
  return (
    <Layout>
      <Header />
        <Hero />
        <div className="bg-white border-l-2 border-r-2 min-h-min flex items-center justify-center max-w-[1090px] mx-auto pt-4 pb-8 px-8">
            <RegisterForm />
          </div>
      <Footer />
    </Layout>
  )
} 