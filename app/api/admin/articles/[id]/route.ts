import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: context.params.id },
      include: { category: true }
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
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

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    
    const article = await prisma.article.update({
      where: { id: context.params.id },
      data: {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        blurb: formData.get('blurb')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        headerImage: formData.get('headerImage')?.toString() || '/placeholder.jpg',
        categoryId: formData.get('categoryId')?.toString() || '',
        isFeatured: formData.get('isFeatured') === 'true',
        scheduledFor: formData.get('scheduledFor') ? new Date(formData.get('scheduledFor')?.toString() || '') : null,
        updatedAt: new Date(),
        articleStatus: formData.get('articleStatus')?.toString() || 'DRAFT'
      },
      include: { category: true }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await prisma.article.delete({
      where: { id: context.params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
} 