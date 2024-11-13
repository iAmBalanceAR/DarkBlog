import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const data = await request.formData()
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  
  try {
    // Ensure uploads directory exists
    await mkdir(uploadDir, { recursive: true })
    
    // Handle file upload if present
    let headerImagePath = '/images/default-header.jpg'
    const headerImage = data.get('headerImage') as File
    if (headerImage?.size > 0) {
      const bytes = await headerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${headerImage.name}`
      await writeFile(path.join(uploadDir, filename), buffer)
      headerImagePath = `/uploads/${filename}`
    }

    // Create article
    const result = await prisma.article.create({
      data: {
        title: String(data.get('title')),
        slug: String(data.get('slug')),
        blurb: String(data.get('blurb')),
        content: String(data.get('content')),
        headerImage: headerImagePath,
        categoryId: String(data.get('categoryId')),
        isFeatured: Boolean(data.get('isFeatured')),
        updatedAt: new Date()
      }
    })
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create article' }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
} 