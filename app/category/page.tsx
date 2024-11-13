import Layout from "@/app/components/layout"
import Header from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { CategoryCard } from "@/app/components/category-card"
import prisma from "@/app/lib/prisma"
import type { Category } from "@prisma/client"
import { Hero } from "../components/hero"


async function getCategories(): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <Layout>
      <Header />
      <Hero />
      <section className="py-12 bg-[rgba(0,0,0,0.02)]">
        <div className="max-w-[1109px] mx-auto px-4">
          <h2 className="text-4xl font-mono mb-10 font-bold tracking-tight text-gray-900 pb-2 border-b border-gray-200">
            Browse Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                count="all"
                key={category.id}
                title={category.name}
                description={category.description}
                image={category.image}
                slug={category.slug}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  )
}