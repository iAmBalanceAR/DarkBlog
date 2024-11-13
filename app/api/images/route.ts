import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    const files = await readdir(uploadsDir)
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/uploads/${file}`)

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Failed to read uploads directory:', error)
    return NextResponse.json({ images: [] })
  }
} 