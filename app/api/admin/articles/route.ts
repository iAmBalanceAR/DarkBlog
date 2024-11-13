import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

interface Article {
  id: string
  title: string
  category: {
    id: string
    name: string
  }
  // Add other properties that your article might have
  content?: string
  published?: boolean
  authorId?: string
  createdAt?: Date
  updatedAt?: Date
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await request.formData()
    
    const article = await prisma.article.create({
      data: {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        blurb: formData.get('blurb')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        headerImage: formData.get('headerImage')?.toString() || '/placeholder.jpg',
        categoryId: formData.get('categoryId')?.toString() || '',
        isFeatured: formData.get('isFeatured') === 'true',
        scheduledFor: formData.get('scheduledFor') ? new Date(formData.get('scheduledFor')?.toString() || '') : null,
        updatedAt: new Date(),
        publishedAt: null,
        articleStatus: formData.get('articleStatus')?.toString() || 'DRAFT',
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create article'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        category: {
          select: {
            name: true
          }
        },
        articleStatus: true,
        scheduledFor: true,
        publishedAt: true,
        updatedAt: true,
        isFeatured: true
      }
    })

    const mappedArticles = articles.map((article: {
      id: string;
      title: string;
      articleStatus: string;
      scheduledFor: Date | null;
      publishedAt: Date | null;
      isFeatured: boolean;
      updatedAt: Date;
      category: { name: string };
    }) => ({
      id: article.id,
      title: article.title,
      category: article.category,
      status: article.articleStatus,
      scheduledFor: article.scheduledFor,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      isFeatured: article.isFeatured
    }))

    return NextResponse.json(mappedArticles)

  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
} 