import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserRole(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    console.log('Updated user:', user)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Replace with your email
updateUserRole('arkansasdj@gmail.com') 