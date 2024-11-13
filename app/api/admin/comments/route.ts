import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            userName: true,
          },
        },
        article: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
} 