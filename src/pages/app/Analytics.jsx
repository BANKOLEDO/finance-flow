// src/pages/dashboard/Analytics.jsx
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useDataManager } from '../../hooks/useDataManager'
import StatsOverview from '../../components/analytics/StatsOverview'
import IncomeExpenseChart from '../../components/analytics/IncomeExpenseChart'
import ExpenseCategories from '../../components/analytics/ExpenseCategories'
import BalanceTrendChart from '../../components/analytics/BalanceTrendChart'
import TransactionSummary from '../../components/analytics/TransactionSummary'

export default function Analytics() {
  const { transactions, categories, loading } = useDataManager()

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const avgTransaction = transactions.length > 0 
      ? (totalIncome + totalExpenses) / transactions.length 
      : 0

    return {
      totalIncome,
      totalExpenses,
      netWorth: totalIncome - totalExpenses,
      avgTransaction,
      transactionCount: transactions.length
    }
  }, [transactions])

  if (loading.transactions) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your financial performance and insights</p>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Chart */}
          <IncomeExpenseChart transactions={transactions} />
          
          {/* Expense Categories */}
          <ExpenseCategories transactions={transactions} categories={categories} />
          
          {/* Balance Trend with Filters */}
          <BalanceTrendChart transactions={transactions} />
        </div>

        {/* Transaction Summary */}
        <TransactionSummary stats={stats} transactions={transactions} />
      </div>
    </DashboardLayout>
  )
}