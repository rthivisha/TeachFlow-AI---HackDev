import { useState } from 'react'
import { searchResources } from '../lib/search'
import type { SearchResponse } from '../lib/search'


export function useSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const triggerSearch = async (params: {
    topic: string
    board: string
    grade: string
    language: string
    types: string[]
  }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchResources(params)
      setResults(data)
      return data
    } catch (err: any) {
      console.error("Search execution failed:", err)
      setError(err.message || "An unexpected search error occurred. Please try again.")
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults(null)
    setError(null)
  }

  return {
    results,
    loading,
    error,
    triggerSearch,
    clearResults
  }
}
