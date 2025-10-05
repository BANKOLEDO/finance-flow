// src/components/DebugAuth.jsx - TEMPORARY
import { useAuth } from '../contexts/AuthContext'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'

export default function DebugAuth() {
  const { user, profile, loading: authLoading } = useAuth()
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()

  console.log('=== DEBUG AUTH ===')
  console.log('User:', user?.id)
  console.log('Auth Loading:', authLoading)
  console.log('Profile:', profile)
  console.log('Transactions Loading:', transactionsLoading)
  console.log('Categories Loading:', categoriesLoading)
  console.log('Transactions Error:', transactionsError)
  console.log('Categories Error:', categoriesError)
  console.log('Transactions Count:', transactions.length)
  console.log('Categories Count:', categories.length)

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400">
      <h3 className="font-bold">Debug Info:</h3>
      <pre className="text-xs">
        {JSON.stringify({
          user: user ? { id: user.id, email: user.email } : null,
          authLoading,
          profile: !!profile,
          transactionsLoading,
          categoriesLoading,
          transactionsCount: transactions.length,
          categoriesCount: categories.length,
          transactionsError,
          categoriesError
        }, null, 2)}
      </pre>
    </div>
  )
}