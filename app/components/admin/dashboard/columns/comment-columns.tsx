'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/app/components/UI/button"
import { Eye, Trash2, Edit2 } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

export type Comment = {
  id: string
  content: string
  articleId: string
  userId: string
  createdAt: string
  user: {
    userName: string
  }
  article: {
    title: string
  }
}

export const commentColumns = ({ onView }: { onView: (comment: Comment) => void }): ColumnDef<Comment>[] => [
  {
    accessorKey: "user.userName",
    header: "User",
  },
  {
    accessorKey: "article.title",
    header: "Article",
  },
  {
    accessorKey: "content",
    header: "Comment",
    cell: ({ row }) => {
      const content = row.getValue("content") as string
      return <div className="max-w-[300px] truncate">{content}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Posted",
    cell: ({ row }) => {
      return formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true })
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