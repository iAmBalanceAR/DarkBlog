import prisma from './prisma'

export async function getArticle(slug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug: slug,
    },
    include: {
      category: true,
    },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  return article
}