import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        articles: {
          where: {
            articleStatus: 'PUBLISHED'
          },
          select: {
            title: true,
            headerImage: true,
            slug: true,
            publishedAt: true,
            category: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            publishedAt: 'desc'
          }
        }
      }
    });

    // Convert publishedAt dates to strings
    const formattedCategories = categories.map(category => ({
      ...category,
      articles: category.articles.map(article => ({
        ...article,
        publishedAt: article.publishedAt?.toISOString() || ''
      }))
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
} 