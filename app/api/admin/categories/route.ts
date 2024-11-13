import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// Create new category
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    console.log('Creating category with data:', {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      image: formData.get('image')  // Check if image URL is present
    })
    
    const category = await prisma.category.create({
      data: {
        name: formData.get('name')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        description: formData.get('description')?.toString() || null,
        image: formData.get('image')?.toString() || null,
      }
    })

    console.log('Created category:', category)  // Check what was actually saved

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 })
  }
} 