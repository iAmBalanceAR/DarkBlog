'use client'

import { useState } from 'react'
import { Button } from '@/app/components/UI/button'
import { Textarea } from '@/app/components/UI/textarea'
import { X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Comment } from './columns/comment-columns'

interface CommentModalProps {
  comment: Comment
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  onEdit: (id: string, content: string) => Promise<void>
}

export function CommentModal({ comment, onClose, onDelete, onEdit }: CommentModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = async () => {
    setIsSubmitting(true)
    try {
      await onEdit(comment.id, editedContent)
      setIsEditing(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-100">Comment Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">User</label>
            <p className="text-gray-100">{comment.user.userName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Article</label>
            <p className="text-gray-100">{comment.article.title}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Posted</label>
            <p className="text-gray-100">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Content</label>
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                rows={4}
              />
            ) : (
              <p className="text-gray-100 whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(comment.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 