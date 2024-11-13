import { Metadata } from 'next'
import Layout from "@/app/components/layout"
import Header from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { CategoryHeader } from "@/app/components/category-header"
import { BlogGrid } from "@/app/components/blog-grid"
import prisma from "@/app/lib/prisma"
import { notFound } from "next/navigation"
import { Hero } from "@/app/components/hero"
import { createDeflate } from 'zlib'
interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

async function getCategoryWithArticles(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: {
            articleStatus: 'PUBLISHED'
          },
          orderBy: {
            publishedAt: 'desc'
          }
        }
      }
    })

    if (!category) {
      return null
    }

    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = await getCategoryWithArticles(resolvedParams.slug)
  
  if (!category) {
    notFound()
  }

  const formattedBlogs = category.articles.map(article => (
    {
    createdAt: article.createdAt.toISOString(),
    img: article.headerImage,
    title: article.title,
    category: category.name,
    subcategory: category.name,
    slug: article.slug,
    categorySlug: category.slug,
    blurb: article.blurb
  }))

  return (
    <Layout>
      <Header />
      <Hero />  
      <div className=''>
      <CategoryHeader 
        title={category.name}
        description={category.description || ''}
        image={category.image || ''}
      />
      <BlogGrid 
        title={`Latest in ${category.name}`}
        blogs={formattedBlogs}
        
      />
      </div>
      <Footer />
    </Layout>
  )
} 

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryWithArticles(resolvedParams.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | DarkBlog: The Modern Content Creator's Platform`,
    description: category.description || undefined,
  };
} 