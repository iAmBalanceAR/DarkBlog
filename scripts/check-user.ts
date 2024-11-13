import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    })

    console.log('User details:', user)
  } catch (error) {
    console.error('Error checking user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Replace with your email
checkUser('arkansasdj@gmail.com')