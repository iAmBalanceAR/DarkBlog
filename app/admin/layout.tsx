'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AdminSidebar } from "@/app/components/admin/layout/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900">
        <AdminSidebar />
        <div className="pl-64">
          <main className="p-8">
            <div className="text-gray-100">
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
} 