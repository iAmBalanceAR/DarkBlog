import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    console.log('Received form data keys:', Array.from(formData.keys()))
    const file = formData.get('image') as File

    if (!file) {
      console.log('No file found in form data')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public/uploads')
    console.log('Upload directory:', uploadDir)
    console.log('Directory exists:', require('fs').existsSync(uploadDir))
    try {
      await import('fs').then(fs => 
        fs.promises.mkdir(uploadDir, { recursive: true })
      )
    } catch (error) {
      console.error('Error creating uploads directory:', error)
    }

    // Create unique filename
    const timestamp = Date.now()
    const fileName = `${session.user.id}-${timestamp}-${file.name}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to public directory
    const path = join(uploadDir, fileName)
    await writeFile(path, buffer)

    // Return the URL path to the uploaded file
    const url = `/uploads/${fileName}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 