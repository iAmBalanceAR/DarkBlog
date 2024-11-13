import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, articleId } = await request.json();

    // Get the current highest order number for this article
    const lastComment = await prisma.comment.findFirst({
      where: { articleId },
      orderBy: { order: 'desc' },
    });

    const newOrder = (lastComment?.order ?? 0) + 1;

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId: session.user.id,
        order: newOrder,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            userName: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json(
      { error: 'Article ID is required' },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { order: 'asc' },
      include: {
        user: {
          select: {
            userName: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
} 