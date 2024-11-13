import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string | null
      userName: string
      firstName: string
      lastName: string
      profileImage: string | null
      socialLink1: string | null
      socialLink2: string | null
      socialLink3: string | null
      role: string
    }
  }

  interface User {
    id: string
    email: string
    userName: string
    firstName: string
    lastName: string
    profileImage: string | null
    socialLink1: string | null
    socialLink2: string | null
    socialLink3: string | null
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            userName: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            socialLink1: true,
            socialLink2: true,
            socialLink3: true,
            role: true,
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage ?? null,
          socialLink1: user.socialLink1 ?? null,
          socialLink2: user.socialLink2 ?? null,
          socialLink3: user.socialLink3 ?? null,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.userName = user.userName
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.profileImage = user.profileImage
        token.socialLink1 = user.socialLink1
        token.socialLink2 = user.socialLink2
        token.socialLink3 = user.socialLink3
        token.role = user.role
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string
        session.user.userName = token.userName as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.profileImage = token.profileImage as string | null
        session.user.socialLink1 = token.socialLink1 as string | null
        session.user.socialLink2 = token.socialLink2 as string | null
        session.user.socialLink3 = token.socialLink3 as string | null
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/admin/logout',
  }
}