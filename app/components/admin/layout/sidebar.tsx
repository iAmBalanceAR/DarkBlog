'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  Key, 
  User,
  LogOut,
  Home,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Users & Comments', href: '/admin/dashboard' },
  { icon: FileText, label: 'Articles', href: '/admin/articles' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: User, label: 'Profile', href: '/admin/profile' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-gray-100">Admin Panel</h1>
      </div>
      
      <nav className="px-4 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md mb-1 transition-colors ${
                isActive 
                  ? 'bg-gray-700 text-gray-100' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-8 left-0 right-0 px-8">
        <button 
          onClick={() => {
            window.location.href = '/'
          }}
          className="flex items-center gap-3 text-gray-400 hover:text-gray-100 transition-colors w-full mb-4"
        >
          <Home className="w-5 h-5" />
          Main Page
        </button>        
        <button 
          onClick={() => {
            localStorage.removeItem('adminToken')
            window.location.href = '/admin/login'
          }}
          className="flex items-center gap-3 text-gray-400 hover:text-gray-100 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
} 