import { useState } from 'react'
import { Trash2, CreditCard } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useDataManager } from '../../hooks/useDataManager'
import AddTransaction from '../../components/transactions/AddTransaction'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function Transactions() {
  const { transactions, categories, loading, refetchTransactions } = useDataManager()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  const deleteTransaction = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    
    setDeleting(id)
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      // Refetch after delete
      await refetchTransactions()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete transaction')
    } finally {
      setDeleting(null)
    }
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'income') return t.type === 'income'
    if (filter === 'expense') return t.type === 'expense'
    return true
  })

  const getCategoryName = (id) => {
    return categories.find(c => c.id === id)?.name || 'Uncategorized'
  }

  const getCategoryColor = (id) => {
    return categories.find(c => c.id === id)?.color || '#6b7280'
  }

  if (loading.transactions) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Manage your income and expenses</p>
          </div>
          <AddTransaction onTransactionAdded={refetchTransactions} />
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filter === 'income'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filter === 'expense'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expenses
            </button>
          </div>
        </Card>

        {/* Transactions List */}
        <Card className="p-4 sm:p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">
                {transactions.length === 0 
                  ? "Get started by adding your first transaction."
                  : "Try changing your filters to see more results."
                }
              </p>
              {transactions.length === 0 && <AddTransaction />}
            </div>
          ) : (
            <div className="space-y-3 max-w-full overflow-hidden">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 min-w-0"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(transaction.category_id) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {transaction.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {getCategoryName(transaction.category_id)}
                      </p>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0 ml-2">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-4 flex-shrink-0">
                    <div className={`text-right font-semibold text-sm sm:text-base whitespace-nowrap ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      disabled={deleting === transaction.id}
                      className="p-1 sm:p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50 flex-shrink-0"
                    >
                      {deleting === transaction.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
              <span className="text-gray-600 text-center sm:text-left">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
              <div className="flex justify-center sm:justify-end space-x-4 sm:space-x-6">
                <div className="text-green-600 whitespace-nowrap">
                  Income: ${filteredTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    .toFixed(2)}
                </div>
                <div className="text-red-600 whitespace-nowrap">
                  Expenses: ${filteredTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}