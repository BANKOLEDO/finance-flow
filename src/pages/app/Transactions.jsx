import { useState, useMemo } from 'react'
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

  // Calculate summary stats
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const balance = income - expenses

    return {
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
      balance: parseFloat(balance.toFixed(2))
    }
  }, [filteredTransactions])

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
            <div className="text-center flex flex-col justify-center items-center py-12">
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
                  className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 min-w-0 transition-colors duration-200"
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
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500 truncate">
                          {getCategoryName(transaction.category_id)}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-2 flex-shrink-0">
                    <div className={`text-right font-semibold text-sm sm:text-base whitespace-nowrap ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      disabled={deleting === transaction.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-all duration-200 disabled:opacity-50 flex-shrink-0 rounded-lg hover:bg-red-50"
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

        {/* Summary with Balance */}
        {filteredTransactions.length > 0 && (
          <Card className="p-4">
            <div className="space-y-4 sm:space-y-0">
              {/* Transaction Count */}
              <div className="text-center sm:text-left">
                <span className="text-gray-600 text-sm">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </span>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center sm:text-left">
                {/* Income */}
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <div className="text-sm text-green-600 font-medium mb-1">Income</div>
                  <div className="text-lg sm:text-xl font-bold text-green-700">
                    +${summary.income.toFixed(2)}
                  </div>
                </div>

                {/* Expenses */}
                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                  <div className="text-sm text-red-600 font-medium mb-1">Expenses</div>
                  <div className="text-lg sm:text-xl font-bold text-red-700">
                    -${summary.expenses.toFixed(2)}
                  </div>
                </div>

                {/* Balance */}
                <div className={`rounded-lg p-3 sm:p-4 ${
                  summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
                }`}>
                  <div className={`text-sm font-medium mb-1 ${
                    summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    Balance
                  </div>
                  <div className={`text-lg sm:text-xl font-bold ${
                    summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'
                  }`}>
                    {summary.balance >= 0 ? '+' : ''}${summary.balance.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Income Transactions</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {filteredTransactions.filter(t => t.type === 'income').length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Expense Transactions</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {filteredTransactions.filter(t => t.type === 'expense').length}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}