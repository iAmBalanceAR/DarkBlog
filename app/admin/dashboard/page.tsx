'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/app/components/admin/dashboard/data-table'
import { CommentModal } from '@/app/components/admin/dashboard/comment-modal'
import { UserModal } from '@/app/components/admin/dashboard/user-modal'
import { Comment, commentColumns } from '@/app/components/admin/dashboard/columns/comment-columns'
import { User, userColumns } from '@/app/components/admin/dashboard/columns/user-columns'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/UI/tabs'

interface DeleteParams {
  id: string;
}

interface EditCommentParams {
  id: string;
  content: string;
}

interface UpdateRoleParams {
  id: string;
  role: string;
}

export default function DashboardPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/comments').then(res => res.json()),
      fetch('/api/admin/users').then(res => res.json())
    ]).then(([commentsData, usersData]) => {
      setComments(commentsData)
      setUsers(usersData)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="comments" className="w-full">
        <TabsList>
          <TabsTrigger value="comments">Comment Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="comments">
          <DataTable
            columns={commentColumns({ 
              onView: (comment) => {
                setSelectedComment(comment)
                setShowCommentModal(true)
              }
            })}
            data={comments}
          />
        </TabsContent>

        <TabsContent value="users">
          <DataTable
            columns={userColumns({ 
              onView: (user) => {
                setSelectedUser(user)
                setShowUserModal(true)
              }
            })}
            data={users}
          />
        </TabsContent>
      </Tabs>

      {showCommentModal && selectedComment && (
        <CommentModal
          comment={selectedComment}
          onClose={() => {
            setShowCommentModal(false)
            setSelectedComment(null)
          }}
          onDelete={async (id: string) => {
            // Handle delete
            const res = await fetch(`/api/admin/comments/${id}`, { 
              method: 'DELETE' 
            })
            if (res.ok) {
              setComments(comments.filter(c => c.id !== id))
            }
          }}
          onEdit={async (id: string, content: string) => {
            // Handle edit
            const res = await fetch(`/api/admin/comments/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content })
            })
            if (res.ok) {
              setComments(comments.map(c => 
                c.id === id ? { ...c, content } : c
              ))
            }
          }}
        />
      )}

      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false)
            setSelectedUser(null)
          }}
          onDelete={async (id: string) => {
            // Handle delete
            const res = await fetch(`/api/admin/users/${id}`, { 
              method: 'DELETE' 
            })
            if (res.ok) {
              setUsers(users.filter(u => u.id !== id))
            }
          }}
          onUpdateRole={async (id: string, role: string) => {
            // Handle role update
            const res = await fetch(`/api/admin/users/${id}/role`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role })
            })
            if (res.ok) {
              setUsers(users.map(u => 
                u.id === id ? { ...u, role } : u
              ))
            }
          }}
        />
      )}
    </div>
  )
} 