// src/hooks/useSimpleTransactions.js - TEMPORARY TEST
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useSimpleTransactions = () => {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('useSimpleTransactions: User changed', user?.id)
    
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    const fetchData = async () => {
      console.log('Fetching transactions for user:', user.id)
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)

        console.log('Fetch result:', { data, error })
        
        if (error) {
          console.error('Fetch error:', error)
          throw error
        }

        setData(data || [])
      } catch (error) {
        console.error('Error in useSimpleTransactions:', error)
        setData([])
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  return { transactions: data, loading }
}