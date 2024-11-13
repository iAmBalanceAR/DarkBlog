'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/app/components/UI/button';
import { Textarea } from '@/app/components/UI/textarea';
import Link from 'next/link';

interface CommentProps {
  id: string;
  content: string;
  userId: string;
  userName?: string;
  user?: {
    userName: string;
    profileImage?: string;
  };
  profileImage?: string;
  createdAt: string;
  articleTitle?: string;
  articleSlug?: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

export function Comment({
  id,
  content,
  userId,
  userName,
  user,
  profileImage,
  createdAt,
  articleTitle,
  articleSlug,
  onDelete,
  onUpdate
}: CommentProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  console.log('Comment component debug:', {
    commentUserId: userId,
    sessionUserId: session?.user?.id,
    sessionUserRole: session?.user?.role,
    canModify: session?.user?.id === userId || session?.user?.role === 'ADMIN'
  });

  const canModify = Boolean(
    session?.user && (
      session.user.id === userId || 
      session.user.role === 'ADMIN'
    )
  );

  const handleUpdate = async () => {
    if (editedContent.trim() === '') return;
    await onUpdate(id, editedContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const displayName = userName || user?.userName || 'Unknown User';
  const displayImage = profileImage || user?.profileImage;

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={editedContent.trim() === ''}
            >
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(content);
              }}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {displayImage && (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <span className="font-medium text-gray-900">{displayName}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {canModify && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-2">{content}</p>
          {articleTitle && articleSlug && (
            <Link 
              href={`/article/${articleSlug}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              on: {articleTitle}
            </Link>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Comment?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 