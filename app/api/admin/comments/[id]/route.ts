import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params
  try {
    await prisma.comment.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params
  try {
    const body = await request.json()
    const { content } = body

    const comment = await prisma.comment.update({
      where: { id: params.id },
      data: { content },
      include: {
        user: {
          select: {
            userName: true,
            profileImage: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
} 