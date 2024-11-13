import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    const [
      articles,
      categories,
      drafts,
      scheduled
    ] = await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.article.count({
        where: { articleStatus: 'DRAFT' }
      }),
      prisma.article.count({
        where: { articleStatus: 'SCHEDULED' }
      })
    ])

    return NextResponse.json({
      articles,
      categories,
      views: 0, // You'll need to implement view tracking
      drafts,
      scheduled
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 