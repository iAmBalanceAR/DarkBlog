import { Users, FileText, FolderOpen } from 'lucide-react'

const navigationItems = [
  {
    title: 'Users & Comments',
    href: '/admin/dashboard',
    icon: Users,
  },
  {
    title: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
  },
]

export default navigationItems 