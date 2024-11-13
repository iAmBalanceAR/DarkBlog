import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;
      
      // Admin routes require ADMIN role
      // if (pathname.startsWith('/admin')) {
      //   return token?.role === 'ADMIN'
      //}

      // API routes for comments require authentication
      if (pathname.startsWith('/api/comments')) {
        return !!token
      }

      // Allow other routes
      return true
    }
  }
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/comments/:path*',
    '/api/comments/user/:path*',
    '/api/comments/[id]/:path*'
  ]
} 