'use client'

import { useRouter } from 'next/navigation'
import { ProfileForm } from '@/app/components/admin/profile/profile-form'
import Layout from "@/app/admin/layout"
import initialData from '@/app/admin/profile/page'
export default function ProfileEditPage() {
  return (
    <Layout>
      <div className="p-6">
        <ProfileForm initialData={initialData().props} />
      </div>
    </Layout>
  )
}