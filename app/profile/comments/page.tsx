import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Hero } from '@/app/components/hero';

const prisma = new PrismaClient();

export default async function UserCommentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const comments = await prisma.comment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      article: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <Link 
                  href={`/article/${comment.article.slug}`}
                  className="text-lg font-medium text-blue-600 hover:text-blue-800"
                >
                  {comment.article.title}
                </Link>
                <p className="mt-2 text-gray-600">{comment.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-gray-500">You haven't made any comments yet.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 