import { Metadata } from 'next'
import { Key, Suspense } from 'react'
import Layout from "@/app/components/layout"
import Header from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { BlogGrid } from "@/app/components/blog-grid"
import LoadingSpinner from '@/app/components/LoadingSpinner'
import prisma from '@/app/lib/prisma'
import { CategoryCard } from '@/app/components/category-card'
import { SocialContact } from './components/social-contact'
import { Hero } from '@/app/components/hero'
import Link from 'next/link'

const getArticles = async () => {
  const articles = await prisma.article.findMany({
    where: {
      articleStatus: 'PUBLISHED'
    },
    include: {
      category: true,
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })
  return articles
}
export const metadata: Metadata = {
  title: 'DarkBlog - Modern Content Management',
  description: 'A modern blogging platform built for content creators',
  keywords: ['blog', 'CMS', 'content management', 'writing platform'],
  authors: [{ name: 'Jason Haynie' }],
  openGraph: {
    title: 'DarkBlog',
    description: 'Modern Content Management System',
    type: 'website',
  },
}
export default async function Home() {
  const articles = await getArticles()

  return (
    <Layout>
      <Header />
      <Hero />
      <SocialContact />
      <Suspense fallback={<LoadingSpinner size="large" />}>
        <BlogGrid 
          count={6}
          title="Latest Articles" 
          blogs={articles.map((article: {createdAt:any; headerImage: any; title: any; category: { name: any; slug: any }; slug: any; blurb: any }) => ({
            createdAt: article.createdAt,
            img: article.headerImage,
            title: article.title,
            category: article.category.name,
            subcategory: '',
            slug: article.slug,
            categorySlug: article.category.slug,
            blurb: article.blurb
          }))} 
        />
          <div className='border-r-2 border-l-2 bg-white mb-0 max-w-[1109px] m-auto clear-both pb-8'>
            <h2 className="text-4xl pl-4 font-mono font-bold tracking-tight text-gray-900 pb-0 border-b border-gray-200">
              Top Categories
            </h2>
          </div>        
        <div className="bg-white border-r-2 border-l-2 grid md:grid-cols-3 p-4 max-w-[1109px] m-auto gap-6">
          {articles[0]?.category && articles.reduce((uniqueCategories: any[], article: { category: { id: any; name: any; description: any; image: any; slug: any } }) => {
            if (!uniqueCategories.find(c => c.id === article.category.id)) {
              uniqueCategories.push({
                id: article.category.id,
                name: article.category.name,
                description: article.category.description,
                image: article.category.image,
                slug: article.category.slug
              });
            }
            return uniqueCategories;
          }, [])
          .slice(0, 3)
          .map((category: { id: Key | null | undefined; name: string; description: string | null | undefined; image: string | null | undefined; slug: string }) => (
            <CategoryCard count={3} key={category.id} title={category.name} description={category.description} image={category.image} slug={category.slug} />
          ))}
        </div>
        <div className="m-auto max-w-[1109px] align-center justify-center text-center bg-white pb-4 pt-4 border-r-2 border-l-2 ">
        <Link
          href="/category" 
          className="bg-gray-100 hover:bg-green-200 hover:text-slate-800 border border-gray-400  text-gray-800 px-4 py-2 rounded-sm"
        >
          View All Categories
        </Link>
      </div>        
      </Suspense>
      <Footer />
    </Layout>
    )
  }  
