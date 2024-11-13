import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/app/lib/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get('email')?.toString() || ''
    const password = formData.get('password')?.toString() || ''
    const firstName = formData.get('firstName')?.toString() || ''
    const lastName = formData.get('lastName')?.toString() || ''
    
    // Generate username from email
    const userName = email.split('@')[0]

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user with default values
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userName,
        firstName,
        lastName,
        role: 'USER',
        profileImage: null,
        socialLink1: null,
        socialLink2: null,
        socialLink3: null
      }
    })

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        firstName,
        lastName
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 