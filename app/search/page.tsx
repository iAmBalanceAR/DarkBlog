'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/app/components/layout'
import Header from '@/app/components/header'
import { Footer } from '@/app/components/footer'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { Button } from '@/app/components/UI/button'
import { Hero } from '@/app/components/hero'

interface SearchResult {
  id: string
  title: string
  blurb: string
  slug: string
  category: {
    name: string
    slug: string
  }
}

// Create a separate component for the search results
function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Search failed')
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search error:', error)
        setError('Failed to perform search')
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    performSearch()
  }, [query])

  return (
    <Layout>
      <Header />
      <Hero />
      <main className=" ">
        <div className=" bg-white shadow-lg max-w-[1077px] mx-auto px-4 py-8 ">
          <h1 className="text-2xl font-bold mb-2">
            Search Results {query && `for "${query}"`}
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : results.length === 0 ? (
            <div className="text-gray-500">
              {query ? 'No results found' : 'Enter a search term to begin'}
            </div>
          ) : (
            <div className="space-y-8 mt-6">
              {results.map((result) => (
                <div key={result.id} className="border-b border-gray-200 pb-6">
                  <Link 
                    href={`/article/${result.slug}`}
                    className="text-xl font-semibold text-blue-600 hover:underline block mb-2"
                  >
                    {result.title}
                  </Link>
                  <div className="text-sm text-gray-500 mb-2">
                    in {result.category.name}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {result.blurb}
                  </p>
                  <Link href={`/article/${result.slug}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-sm"
                    >
                      View Article
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </Layout>
  )
}

// Main page component
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
} 