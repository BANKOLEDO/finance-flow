import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color,
            budget_limit
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addTransaction = async (transactionData) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            ...transactionData,
            user_id: user.id,
            amount: Math.abs(parseFloat(transactionData.amount))
          }
        ])
        .select(`
          *,
          categories (
            name,
            color,
            budget_limit
          )
        `)
        .single()

      if (error) throw error
      
      // Immediately refetch to update the list
      fetchTransactions()
      
      return { data, error: null }
    } catch (error) {
      console.error('Error adding transaction:', error)
      return { data: null, error }
    }
  }

  const deleteTransaction = async (transactionId) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', user.id)

      if (error) throw error
      
      // Immediately refetch to update the list
      fetchTransactions()
      
      return { error: null }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      return { error }
    }
  }

  useEffect(() => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    // Initial fetch
    fetchTransactions()

    // Poll every 3 seconds
    const interval = setInterval(fetchTransactions, 3000)

    // Cleanup
    return () => clearInterval(interval)
  }, [user, fetchTransactions])

  return { 
    transactions, 
    loading, 
    error,
    refetch: fetchTransactions,
    addTransaction,
    deleteTransaction
  }
}