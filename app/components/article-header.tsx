'use client'

import { useState } from "react"
import Image from "next/image"


interface Article {
  id: string;
  title: string;
  slug: string;
  blurb: string;
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
}

interface ArticleHeaderProps {
  title: string;
  category: string;
  date: string;
  image: string;
  article: Article;
}

export function ArticleHeader({ title, category, date, image, article }: ArticleHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Guard against empty headerImage
  if (!article?.headerImage) {
    return null;
  }

  console.log('Article data:', {
    title: article.title, publishedAt: article.publishedAt,
    hasPublishedAt: !!article.publishedAt,
    fullArticle: article
  });

  return (
    <>
    
    <div className="relative">
      <div className="relative aspect-[4/1] w-full">
        <Image 
          src={article.headerImage || '/placeholder.jpg'} // Fallback image
          alt={article.title || 'Article header image'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white font-sans p-6">
          <h1 className="text-shadow-lg font-bold md:text-5xl text-6xl font-mono mb-4 max-w-5xl">{article.title}</h1>
          <div className="text-shadow-lg text-normal font-mono  max-w-[800px]">
            {article.blurb}
            <div className="flex items-start justify-start">
                {article.category && (
                  <div className="align-middle m-auto text-shadow-lg  mt-4 inline-block px-2 py-1 rounded-md bg-blue-600/50 text-md font-medium mb-4">
                    {article.category.name}
                    {article.publishedAt && (
                      <div className="text-lg text-gray-200">
                        {article.publishedAt.toDateString()}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-[1109px] m-auto aspect-video">
            <Image 
              src={article.headerImage}
              alt={article.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        )}      
    </>
  )
}