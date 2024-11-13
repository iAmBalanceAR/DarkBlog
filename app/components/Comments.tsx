'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface CommentUser {
  userName: string;
  profileImage: string | null;
}

interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUser;
}

interface CommentsProps {
  articleId: string;
  initialComments: CommentType[];
}

export default function Comments({ articleId, initialComments }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          articleId,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 max-w-[800px] m-auto">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mb-8">Please <a href="/auth/login" className="text-blue-600">login</a> to comment.</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b ">
            <div className="flex items-center gap-2">
              {comment.user.profileImage ? (
                <img
                  src={comment.user.profileImage}
                  alt={comment.user.userName}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {comment.user.userName[0].toUpperCase()}
                </div>
              )}
              <span className="font-medium">{comment.user.userName}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 