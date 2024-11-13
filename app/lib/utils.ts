import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getReadingTime(content: string) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  canonical
}: {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
}) {
  const siteName = 'Balance Dark Blog'
  const formattedTitle = title ? `${title} | ${siteName}` : siteName

  return {
    title: formattedTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: formattedTitle,
      description,
      type: 'website',
      url: canonical,
      images: [
        {
          url: ogImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description,
      images: [ogImage || '/og-image.jpg']
    },
    canonical
  }
}

export function getRelatedArticles(
  currentArticle: string,
  articles: Array<{ id: string; category: string }>,
  limit = 3
) {
  return articles
    .filter(article => 
      article.id !== currentArticle && 
      article.category === articles.find(a => a.id === currentArticle)?.category
    )
    .slice(0, limit)
}

// Predefined set of pleasant background colors
const CATEGORY_COLORS = [
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
  'bg-red-100',
  'bg-orange-100',
  'bg-teal-100',
  'bg-cyan-100'
]

// Get a consistent color for a category based on its name
export function getCategoryColor(categoryName: string): string {
  // Use the category name to get a consistent index
  const index = categoryName
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  // Use modulo to get a color from our array
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}