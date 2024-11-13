'use client';

import { useEffect, useState } from 'react';
import { Navigation } from './navigation';

interface Category {
  name: string;
  slug: string;
  articles: Array<{
    title: string;
    headerImage: string;
    slug: string;
    publishedAt: string;
    category: {
      name: string;
    };
  }>;
}

export function NavigationWrapper() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/navigation');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  return <Navigation initialCategories={categories} />;
} 