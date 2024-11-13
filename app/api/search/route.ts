import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await prisma.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            blurb: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
          {
            category: {
              name: {
                contains: query,
              },
            },
          },
        ],
        AND: {
          articleStatus: 'PUBLISHED',
        },
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 