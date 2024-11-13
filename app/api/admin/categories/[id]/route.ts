import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Helper function to delete image file
async function deleteImageFile(imagePath: string) {
  try {
    if (!imagePath) return

    // Convert URL path to file system path
    const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    const fullPath = path.join(process.cwd(), 'public', relativePath)
    
    console.log('Attempting to delete image:', {
      originalPath: imagePath,
      relativePath,
      fullPath
    })
    
    await unlink(fullPath)
    console.log(`Successfully deleted image file: ${fullPath}`)
  } catch (error) {
    console.error('Error deleting image file:', {
      error,
      path: imagePath
    })
  }
}

// Get single category with articles
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        articles: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// Update category
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // First get the current category to check for existing image
    const currentCategory = await prisma.category.findUnique({
      where: { id: params.id },
      select: { image: true }
    })

    const formData = await request.formData()
    const newImagePath = formData.get('image')?.toString()
    
    // If there's a new image and it's different from the current one,
    // delete the old image
    if (currentCategory?.image && 
        newImagePath && 
        currentCategory.image !== newImagePath) {
      await deleteImageFile(currentCategory.image)
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: formData.get('name')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        description: formData.get('description')?.toString() || null,
        image: newImagePath || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update category'
    }, { status: 500 })
  }
}

// Delete category
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Check for articles using this category
    const articlesUsingCategory = await prisma.article.findMany({
      where: {
        categoryId: params.id
      },
      select: {
        id: true,
        title: true
      }
    })

    // If articles are using this category, return them in the response
    if (articlesUsingCategory.length > 0) {
      return NextResponse.json(
        {
          error: 'Category is in use',
          articles: articlesUsingCategory
        },
        { status: 400 }
      )
    }

    // Get the category to access its image path before deletion
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      select: { image: true }
    })

    // Delete the category
    await prisma.category.delete({
      where: {
        id: params.id
      }
    })

    // After successful category deletion, delete the image file
    if (category?.image) {
      await deleteImageFile(category.image)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
} 