// In your useDataManager hook, add budgets functionality
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useDataManager = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState({
    transactions: true,
    categories: true,
    budgets: true
  })

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return
    
    setLoading(prev => ({ ...prev, transactions: true }))
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }))
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    if (!user) return
    
    setLoading(prev => ({ ...prev, categories: true }))
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(prev => ({ ...prev, categories: false }))
    }
  }

  // Fetch budgets
  const fetchBudgets = async () => {
    if (!user) return
    
    setLoading(prev => ({ ...prev, budgets: true }))
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoading(prev => ({ ...prev, budgets: false }))
    }
  }

  // Refetch functions
  const refetchTransactions = () => fetchTransactions()
  const refetchCategories = () => fetchCategories()
  const refetchBudgets = () => fetchBudgets()

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchCategories()
      fetchBudgets()
    }
  }, [user])

  return {
    transactions,
    categories,
    budgets,
    loading,
    refetchTransactions,
    refetchCategories,
    refetchBudgets
  }
}