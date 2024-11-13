'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    userName: string;
    profileImage?: string;
  };
  article: {
    title: string;
    slug: string;
  };
}

export function useComments(userId: string | undefined) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [userId]);

  return { comments, isLoading, error, setComments };
} 