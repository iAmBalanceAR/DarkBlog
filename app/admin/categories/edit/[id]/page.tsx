import { CategoryFormWrapper } from '@/app/components/admin/categories/category-form-wrapper'
import prisma from '@/app/lib/prisma'

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      slug: true,
      description: true,
      image: true
    }
  })

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Edit Category</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <CategoryFormWrapper categoryId={params.id} initialData={category} />
      </div>
    </div>
  )
} 