export interface Author {
  id: string
  name: string
  image: string
  role: string
  bio?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  author: Author
  category: string
  subcategory?: string
  tags?: string[]
  featured?: boolean
}

export interface Category {
  name: string
  slug: string
  description: string
  image?: string
  featured?: boolean
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'youtube' | 'instagram'
  url: string
  label: string
}

export interface NavigationItem {
  name: string
  href: string
  description?: string
  icon?: string
  items?: NavigationItem[]
}

export interface MetaData {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
}