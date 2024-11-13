import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
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