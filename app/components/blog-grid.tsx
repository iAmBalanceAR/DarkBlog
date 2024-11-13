import Link from "next/link"
import Image from "next/image"

interface Blog {
  img: string
  title: string
  category: string
  subcategory: string
  slug: string
  categorySlug: string
  blurb: string
  createdAt: string
}

interface BlogGridProps {
  title?: string
  blogs: Blog[]
  showLoadMore?: boolean
  count?: number | 'all'
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

export function BlogGrid({ title, blogs, showLoadMore = true, count = 'all' }: BlogGridProps) {
  const sortedBlogs = [...blogs].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const displayedBlogs = count === 'all' 
    ? sortedBlogs 
    : sortedBlogs.slice(0, count)

  return (
    <section className="bg-[rgba(0,0,0,0.02)]">
      <div className="bg-white py-12 border-l-2 border-r-2 max-w-[1109px] mx-auto px-4">
        {title && (
          <h2 className="text-4xl font-mono mb-10 font-bold tracking-tight text-gray-900 pb-2 border-b border-gray-200">
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          {displayedBlogs.map((blog, i) => (
            <Link href={`/article/${blog.slug}#${blog.categorySlug}`} key={i} className="group">
              <div className="border border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform rounded-sm overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-green-300">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image 
                    src={blog.img}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-sm grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 right-0">
                    <div className={`text-xs font-medium px-2 py-1 shadow inline-block ${getCategoryColors(blog.category).bg} ${getCategoryColors(blog.category).text}`}>
                      {blog.category}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h2 
                    className="text-base font-semibold mb-2 leading-relaxed group-hover:text-[rgba(0,0,0,0.65)] transition-colors truncate"
                    title={blog.title}
                  >
                    {blog.title}
                  </h2>
                  <p className="text-sm text-[rgba(0,0,0,0.55)] mb-3 line-clamp-2">
                    {blog.blurb}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {showLoadMore && count !== 'all' && blogs.length > (count as number) && (
        <div className="m-auto max-w-[1109px] align-center justify-center text-center bg-white pb-4 border-r-2 border-l-2 ">
          <Link href="/article" className="bg-gray-100 hover:bg-green-200 hover:text-slate-800 border border-gray-400 text-gray-800 px-4 py-2 rounded-sm">
            View All Articles
          </Link>
        </div>
      )}
    </section>
  )
} 