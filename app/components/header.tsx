"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/app/components/UI/input'
import { Button } from '@/app/components/UI/button'
import { Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import UserBadge from './UserBadge'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="border-b border-[rgba(0,0,0,0.12)]e">
      <div className="max-w-[1109px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg font-bold">DarkBlog</span>
          </Link>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] pl-8"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
              
              
            {/* User Badge */}
            <div className="flex-shrink-0">
              <UserBadge />
            </div>

            {/* <Link href={session ? '/profile' : '/auth/login'}>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                {session ? 'Profile' : 'Login'}
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  )
}