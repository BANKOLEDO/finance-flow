import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useCategories = () => {
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) throw error
      setCategories(data || [])
      setError(null)
    } catch (error) {
      setError(error.message)
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setCategories([])
      setLoading(false)
      return
    }

    // Initial fetch
    fetchCategories()

    // Poll every 8 seconds (categories don't change as often)
    const interval = setInterval(fetchCategories, 8000)

    return () => clearInterval(interval)
  }, [user, authLoading, fetchCategories])

  return { 
    categories, 
    loading, 
    error,
    refetch: fetchCategories 
  }
}