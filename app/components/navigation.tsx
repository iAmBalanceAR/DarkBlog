'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/app/components/UI/input"
import { Button } from "@/app/components/UI/button"
import { Search, ChevronDown, Home } from "lucide-react"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { getCategoryColor } from '@/app/lib/utils'
import { ArticleDetail } from "./article/article-detail"
import ArticlePage from "../article/[slug]/page"
import { CATEGORIES } from "../lib/constants"

interface Article {
  title: string
  headerImage: string
  slug: string
  publishedAt: string
  category: {
    name: string
  }
}

interface Category {
  name: string
  slug: string
  articles: Article[]
}

interface NavigationProps {
  initialCategories: Array<{
    name: string;
    slug: string;
    articles: Array<{
      title: string;
      headerImage: string;
      slug: string;
      publishedAt: string;
      category: {
        name: string;
      };
    }>;
    image: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
  }>;
  activeCategory?: string;
}

export function Navigation({ initialCategories, activeCategory: currentCategory }: NavigationProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [activeHash, setActiveHash] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/navigation')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace('#', '')
      setActiveHash(hash)
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  if (isLoading) {
    return (
      <nav className="border-y border-[rgba(0,0,0,0.12)] relative bg-white">
        <div className="max-w-[1109px] mx-auto px-4 py-4 flex justify-center">
          <LoadingSpinner size="small" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-[rgba(0,0,0,0.10)] relative bg-slate-100 drop-shadow-lg z-50">
      <div className="max-w-[1109px] mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
              <button 
                onClick={() => {
                window.location.href = '/'
              }}
              className="py-3 text-sm px-3 transform transition-all duration-200 flex items-center gap-1 hover:bg-green-300 hover:-translate-y-[2px] hover:shadow-sm" 
            >
              <Home className="w-5 h-5" />
              Home
            </button> 
            
            {categories.map((category) => (
              <div
                key={category.name}
                className="group relative"
                onMouseEnter={() => setOpenCategory(category.name)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <button 
                  className={`py-3 text-sm px-3 transform transition-all duration-200 flex items-center gap-1
                    ${activeHash === category.slug
                      ? 'bg-green-200 -translate-y-[2px] shadow-sm font-bold' 
                      : 'hover:bg-green-300 hover:-translate-y-[2px] hover:shadow-sm'
                    }`}
                >
                  {category.name}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {openCategory === category.name && category.articles.length > 0 && (
                  <div 
                    className="absolute top-full left-0 w-[400px] bg-white shadow-lg border border-[rgba(0,0,0,0.12)] 
                    animate-in fade-in slide-in-from-top-1 duration-300"
                    role="menu"
                  >
                    <div>
                      <div>
                        {category.articles.map((article) => (
                          <Link 
                            href={`/article/${article.slug}#${category.slug}`} 
                            key={article.slug}
                            className="flex gap-4 p-2 hover:bg-green-200 group"
                            role="menuitem"
                          >
                            <div className="relative w-[60px] h-[60px]">
                              <Image 
                                src={article.headerImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[rgba(0,0,0,0.45)] mb-1">
                                <span className={`px-2 py-1 rounded-sm ${getCategoryColor(category.name)}`}>
                                  {category.name}
                                </span>
                              </div>
                              <h3 className="text-sm group-hover:text-[rgba(0,0,0,0.65)] transition-colors leading-tight">
                                {article.title}
                              </h3>
                              <div className="text-xs text-[rgba(0,0,0,0.45)] mt-1">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="p-4 border-t border-[rgba(0,0,0,0.12)]">
                        <Link 
                          href={`/category/${category.slug}`}
                          className="text-sm text-[rgba(0,0,0,0.65)] hover:text-[rgba(0,0,0,0.88)] transition-colors"
                        >
                          View all {category.name.toLowerCase()} →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}