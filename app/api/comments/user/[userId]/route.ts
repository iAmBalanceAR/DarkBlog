import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    console.log('Fetching comments for user ID:', params.userId);
    
    const comments = await prisma.comment.findMany({
      where: {
        userId: params.userId
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            profileImage: true,
          },
        },
        article: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found comments:', comments);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user comments' },
      { status: 500 }
    );
  }
} 