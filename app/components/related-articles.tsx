import Link from "next/link"
import Image from "next/image"

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  category: string
  subcategory: string
  date: string
  author: {
    name: string
    image: string
    role: string
  }
  content?: string
}

interface RelatedArticlesProps {
  title: string
  articles: Article[]
}

export function RelatedArticles({ title, articles }: RelatedArticlesProps) {
  return (
    <section className="border-t border-[rgba(0,0,0,0.12)] pt-8">
      <h2 className="text-2xl font-mono mb-6">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`}>
            <div className="group">
              <div className="relative aspect-[4/3] mb-4">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg mb-2 group-hover:text-[rgba(0,0,0,0.65)] transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-[rgba(0,0,0,0.45)] line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}