"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthProvider } from './components/AuthProvider'


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}  >
        <QueryClientProvider client={queryClient}>
     
          <AuthProvider>
            
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
