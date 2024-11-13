import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const body = await request.json()
    const { role } = body

    if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
} 