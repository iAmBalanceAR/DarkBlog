import { Metadata } from 'next'
import prisma from '@/app/lib/prisma'
import { ArticleHeader } from '@/app/components/article-header'
import { ArticleContent } from '@/app/components/article-content'
import { notFound } from 'next/navigation'
import { SocialShare } from '@/app/components/social-share'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug: resolvedParams.slug,
    },
    select: {
      title: true,
      blurb: true,
    },
  })

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | DarkBlog: The Modern Content Creator's Platform`,
    description: article.blurb,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug: resolvedParams.slug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      blurb: true,
      content: true,
      headerImage: true,
      categoryId: true,
      articleStatus: true,
      scheduledFor: true,
      publishedAt: true,
      isFeatured: true,
      category: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <>
      <ArticleHeader 
        title={article.title} 
        category={article.category.name} 
        date={article.publishedAt?.toISOString() || ''} 
        image={article.headerImage}
        article={article}
      />
      <div className="container mx-auto px-4 relative">
        <SocialShare 
          title={article.title}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}/article/${article.slug}`}
        />
        <ArticleContent 
          title={article.title} 
          category={article.category.name} 
          date={article.publishedAt?.toISOString() || ''} 
          image={article.headerImage}
          article={article}
        />
      </div>
    </>
  )
}