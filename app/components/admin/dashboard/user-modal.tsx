'use client'

import { useState } from 'react'
import { Button } from '@/app/components/UI/button'
import { X } from 'lucide-react'
import type { User } from '../../admin/dashboard/columns/user-columns'

interface UserModalProps {
  user: User
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  onUpdateRole: (id: string, role: string) => Promise<void>
}

export function UserModal({ user, onClose, onDelete, onUpdateRole }: UserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState(user.role)

  const handleRoleUpdate = async () => {
    if (selectedRole === user.role) return
    setIsSubmitting(true)
    try {
      await onUpdateRole(user.id, selectedRole)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-100">User Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-400">Username</label>
              <p className="text-gray-100">{user.userName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Email</label>
              <p className="text-gray-100">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-400">First Name</label>
              <p className="text-gray-100">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Last Name</label>
              <p className="text-gray-100">{user.lastName}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            >
              <option value="USER">User</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleRoleUpdate}
            disabled={isSubmitting || selectedRole === user.role}
            className='text-white bg-green-700 border border-black'
          >
            {isSubmitting ? 'Updating...' : 'Update Role'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(user.id)}
            disabled={isSubmitting}
             className='text-white bg-red-700 border border-black'
          >
            Delete User
          </Button>
        </div>
      </div>
    </div>
  )
} 