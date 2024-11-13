import { CategoryCard } from './category-card'

interface Category {
  title: string
  description?: string | null
  image?: string | null
  slug: string
  createdAt: string
}

interface CategoryGridProps {
  categories: Category[]
  count?: number | 'all'
}

export function CategoryGrid({ categories, count = 'all' }: CategoryGridProps) {
  // Sort categories by newest first
  const sortedCategories = [...categories].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Filter categories based on count
  const displayedCategories = count === 'all' 
    ? sortedCategories 
    : sortedCategories.slice(0, count)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {displayedCategories.map((category) => (
        <CategoryCard
          key={category.slug}
          title={category.title}
          description={category.description}
          image={category.image}
          slug={category.slug}
        />
      ))}
    </div>
  )
} 