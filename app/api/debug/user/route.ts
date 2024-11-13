import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get user directly from database
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        socialLink1: true,
        socialLink2: true,
        socialLink3: true,
        role: true,
      },
    });

    // Return both session data and database data for comparison
    return NextResponse.json({
      sessionUser: session.user,
      databaseUser: userData,
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
} 