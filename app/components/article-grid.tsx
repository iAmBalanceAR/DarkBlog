import { Button } from "@/app/components/UI/button"
import Link from "next/link"
import Image from "next/image"

interface Article {
  img: string
  title: string
  category: string
  subcategory: string
}

interface ArticleGridProps {
  img: string,
  title: string,
  category: string,
  subcategory: string,
  articles: Article[],
  showLoadMore?: boolean
}

const getCategoryColors = (category: string): { bg: string; text: string } => {
  switch (category) {
    case 'IDEAS':
      return { bg: 'bg-blue-200', text: 'text-blue-800' };
    case 'SHORT STORIES':
      return { bg: 'bg-purple-200', text: 'text-purple-800' };
    case 'SPACE / ROCKETS':
      return { bg: 'bg-red-200', text: 'text-red-800' };
    case 'ALL THE META':
      return { bg: 'bg-green-200', text: 'text-green-800' };
    case 'TECHNOLOGY':
      return { bg: 'bg-indigo-200', text: 'text-indigo-800' };
    case 'HEALTH & MEDICINE':
      return { bg: 'bg-emerald-200', text: 'text-emerald-800' };
    default:
      return { bg: 'bg-gray-200', text: 'text-gray-800' };
  }
};

export function ArticleGrid({ title, articles, showLoadMore = true }: ArticleGridProps) {
  return (
    <section className="py-12 bg-[rgba(0,0,0,0.02)]">
      <div className="max-w-[1109px] mx-auto px-4">
        {title && (
          <h2 className="text-4xl font-mono mb-10 font-bold tracking-tight text-gray-900 pb-2 border-b border-gray-200">
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <Link href="#" key={i} className="group">
              <div className="bg-white border border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform rounded-sm overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-green-300">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image 
                    src={article.img}
                    alt={article.title}
                    fill
                    className="object-cover rounded-sm grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 right-0">
                    <div className={`text-xs font-medium px-2 py-1 shadow inline-block ${getCategoryColors(article.category).bg} ${getCategoryColors(article.category).text}`}>
                      {article.category}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h2 
                    className="text-base font-semibold mb-3 leading-relaxed group-hover:text-[rgba(0,0,0,0.65)] transition-colors truncate"
                    title={article.title}
                  >
                    {article.title}
                  </h2>
                  <div className="text-sm font-medium text-[rgba(0,0,0,0.55)] tracking-wide leading-relaxed">
                    {article.subcategory}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {showLoadMore && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="sm" className="h-9 text-sm font-medium px-6">
              LOAD MORE
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}