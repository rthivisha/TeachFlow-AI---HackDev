import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SearchResult } from '../lib/search'


export interface SavedBundle {
  id: string
  user_id: string
  bundle_json: {
    name: string
    resources: SearchResult[]
    context?: {
      board: string
      grade: string
      language: string
      topic: string
    }
  }
  created_at: string
}

export function useBundle() {
  const [bundles, setBundles] = useState<SavedBundle[]>([])
  const [loading, setLoading] = useState(false)

  const loadBundles = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setBundles([])
        return
      }

      const { data, error } = await supabase
        .from('saved_bundles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBundles(data || [])
    } catch (err) {
      console.error("Error loading saved bundles:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveBundle = async (bundleName: string, resources: SearchResult[], context?: SavedBundle['bundle_json']['context']) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("User must be authenticated to save a bundle")
      }

      const bundleContent = {
        name: bundleName,
        resources,
        context
      }

      const { error } = await supabase
        .from('saved_bundles')
        .insert({
          user_id: user.id,
          bundle_json: bundleContent
        })

      if (error) throw error
      
      // Reload lists
      await loadBundles()
      return true
    } catch (err) {
      console.error("Error saving bundle:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteBundle = async (id: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('saved_bundles')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBundles(prev => prev.filter(b => b.id !== id))
      return true
    } catch (err) {
      console.error("Error deleting bundle:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    bundles,
    loading,
    loadBundles,
    saveBundle,
    deleteBundle
  }
}
