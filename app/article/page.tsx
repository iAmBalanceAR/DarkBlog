import Layout from "@/app/components/layout"
import Header from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { BlogGrid } from "@/app/components/blog-grid"
import prisma from "@/app/lib/prisma"
import { Hero } from "../components/hero"

async function getAllArticles() {
  try {
    return await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      },
      where: {
        articleStatus: 'PUBLISHED'
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export default async function ArticlePage() {
  const articles = await getAllArticles()

  const formattedBlogs = articles.map((article: {createdAt:any; headerImage: any; title: any; category: { name: any; slug: any }; slug: any; blurb: any }) => ({
    createdAt: article.createdAt,
    img: article.headerImage,
    title: article.title,
    category: article.category.name,
    subcategory: article.category.name,
    slug: article.slug,
    categorySlug: article.category.slug,
    blurb: article.blurb
  }))

  return (
    <Layout>
      <Header />
      <Hero />
      <BlogGrid 
        title="All Articles"
        blogs={formattedBlogs}
        count="all"
      />
      <Footer />
    </Layout>
  )
}