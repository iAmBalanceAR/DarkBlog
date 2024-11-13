import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { PrismaAdapter } from "@next-auth/prisma-adapter";

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
  adapter: PrismaAdapter(prisma),
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
          profileImage: user.profileImage,
          socialLink1: user.socialLink1,
          socialLink2: user.socialLink2,
          socialLink3: user.socialLink3,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback - incoming token:', token);
      if (token) {
        session.user.id = token.id as string;
        // Fetch complete user data from database
        const userData = await prisma.user.findUnique({
          where: { id: token.sub },
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
          }
        });

        // Update session with complete user data
        session.user = {
          ...session.user,
          ...userData,
          id: token.sub || token.id as string
        };
      }
      console.log('Session callback - final session:', session);
      return session;
    },
    async jwt({ token, user }) {
      console.log('JWT callback - user data:', user);
      if (user) {
        console.log('JWT callback - user data:', user);
        token.id = user.id;
        token.sub = user.id;
      }
      console.log('JWT callback - final token:', token);
      return token;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/register',
  }
}