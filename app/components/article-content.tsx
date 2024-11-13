'use client';

import { useState } from 'react';
import { Comment } from "@/app/components/comments/comment";
import { useSession } from 'next-auth/react';
import { Button } from '@/app/components/UI/button';
import { Textarea } from '@/app/components/UI/textarea';

interface Article {
  id: string;
  title: string;
  slug: string;
  blurb: string;
  content: string;
  headerImage: string;
  categoryId: string;
  category: {
    name: string;
    slug: string;
  };
  articleStatus: string;
  scheduledFor: Date | null;
  publishedAt: Date | null;
  isFeatured: boolean;
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user?: {
      id: string;
      userName: string;
      profileImage: string | null;
    };
  }[];
}

export interface ArticleContentProps {
    title: string;
    category: string;
    date: string;
    image: string;
    article: Article;
}

export function ArticleContent({ title, category, date, image, article: initialArticle }: ArticleContentProps) {
  const { data: session } = useSession();
  const [article, setArticle] = useState(initialArticle);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_COMMENT_LENGTH = 500;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || newComment.length > MAX_COMMENT_LENGTH) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          articleId: article.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const comment = await response.json();
      setArticle(prev => ({
        ...prev,
        comments: [comment, ...(prev.comments || [])],
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div 
        dangerouslySetInnerHTML={{ __html: article.content }}
        className="bg-white border-l-2 border-r-2  max-w-[1109px] p-12 m-auto prose prose-lg text-slate-700 prose-a:text-blue-600 prose-a:hover:text-blue-800"
      />
      
      <div className="bg-white border-l-2 border-r-2 max-w-[1109px] p-12 m-auto">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        
        {session ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <Textarea
              value={newComment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                  setNewComment(e.target.value);
                }
              }}
              placeholder="Write a comment..."
              className="w-full mb-2"
              rows={4}
            />
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm ${newComment.length > MAX_COMMENT_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                {newComment.length}/{MAX_COMMENT_LENGTH} characters
              </span>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim() || newComment.length > MAX_COMMENT_LENGTH}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <p className="mb-8 text-gray-600">
            Please <a href="/auth/login" className="text-blue-600 hover:underline">sign in</a> to leave a comment.
          </p>
        )}

        <div className="space-y-6 max-w-[800px] m-auto">
          {article.comments?.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              content={comment.content}
              userId={comment.userId}
              userName={comment.user?.userName || 'Unknown User'}
              profileImage={comment.user?.profileImage || undefined}
              createdAt={comment.createdAt.toString()}
              onDelete={async (id) => {
                try {
                  const response = await fetch(`/api/comments/${id}`, {
                    method: 'DELETE',
                  });
                  if (!response.ok) throw new Error('Failed to delete comment');
                  setArticle(prev => ({
                    ...prev,
                    comments: prev.comments?.filter(c => c.id !== id)
                  }));
                } catch (error) {
                  console.error('Error deleting comment:', error);
                }
              }}
              onUpdate={async (id, content) => {
                try {
                  const response = await fetch(`/api/comments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                  });
                  if (!response.ok) throw new Error('Failed to update comment');
                  setArticle(prev => ({
                    ...prev,
                    comments: prev.comments?.map(c =>
                      c.id === id ? { ...c, content } : c
                    )
                  }));
                } catch (error) {
                  console.error('Error updating comment:', error);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 