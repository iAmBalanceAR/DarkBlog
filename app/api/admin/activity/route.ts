import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { Article, User } from '@prisma/client'

interface ArticleWithAuthor extends Article {
  author: {
    firstName: string
    lastName: string
    profileImage: string | null
  }
}

interface ActivityItem {
  id: string
  type: 'article' | 'category' | 'keyword'
  action: 'created' | 'updated' | 'deleted'
  title: string
  timestamp: string
}

export async function GET() {
  try {
    // Get the latest articles as activity items
    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      },

    }) as ArticleWithAuthor[]

    // Transform articles into activity items
    const activity: ActivityItem[] = recentArticles.map((article) => ({
      id: article.id,
      type: 'article',
      action: article.publishedAt ? 'updated' : 'created',
      title: article.title,
      timestamp: article.updatedAt.toISOString(),
    }))

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
} 