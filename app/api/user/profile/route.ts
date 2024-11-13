import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // ... existing GET method remains the same ...
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const updateData: any = {};

    // Log the incoming form data
    console.log('Received form data:', Object.fromEntries(formData));

    // Handle all possible form fields
    [
      'userName',
      'firstName',
      'lastName',
      'socialLink1',
      'socialLink2',
      'socialLink3',
      'profileImage'
    ].forEach(field => {
      const value = formData.get(field);
      if (value) updateData[field] = value.toString();
    });

    // Log the data being sent to the database
    console.log('Updating user with data:', updateData);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        userName: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        socialLink1: true,
        socialLink2: true,
        socialLink3: true,
        role: true,
      },
    });

    // Log the updated user data
    console.log('Updated user data:', user);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user profile:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}