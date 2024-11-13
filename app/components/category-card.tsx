import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  title: string
  description?: string | null
  image?: string | null
  slug: string
  count?: number | 'all'
}

export function CategoryCard({ title, description, image, slug, count = 'all' }: CategoryCardProps) {
  if (typeof count === 'number' && count <= 0) {
    return null
  }

  return (
    <Link href={`/category/${slug}`} className="group relative z-0">
      <div className="border border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform rounded-sm overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-green-300">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src={image || '/images/default-category.jpg'}
            alt={title}
            fill
            className="object-cover rounded-sm grayscale transition-all duration-300 group-hover:grayscale-0"
          />
        </div>
        <div className="p-5">
          <h2 
            className="text-base font-semibold mb-3 leading-relaxed group-hover:text-[rgba(0,0,0,0.65)] transition-colors truncate"
            title={title}
          >
            {title}
          </h2>
          {description && (
            <div className="text-sm font-medium text-[rgba(0,0,0,0.55)] tracking-wide leading-relaxed line-clamp-2">
              {description}
            </div>
          )}
        </div>
      </div>
    </Link>          
  )
} 