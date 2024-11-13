import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const article = await prisma.article.findFirst({
      where: {
        slug: params.slug,
        articleStatus: 'PUBLISHED'
      },
      include: {
        category: true
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
} 