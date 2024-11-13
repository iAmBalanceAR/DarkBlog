'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/app/components/UI/button"
import { Eye } from "lucide-react"

export type User = {
  id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export const userColumns = ({ 
  onView 
}: { 
  onView: (user: User) => void 
}): ColumnDef<User>[] => [
  {
    accessorKey: "userName",
    header: "Username",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${role === 'ADMIN' ? 'bg-red-100 text-red-800' : 
          role === 'MODERATOR' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'}`}
        >
          {role}
        </span>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
] 