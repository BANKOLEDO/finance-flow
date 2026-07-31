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
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const avgTransaction =
      transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0

    return {
      totalIncome,
      totalExpenses,
      netWorth: totalIncome - totalExpenses,
      avgTransaction,
      transactionCount: transactions.length,
    }
  }, [transactions])

  if (loading.transactions) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-money-500 border-t-transparent" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink-faint">
              crunching numbers…
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
            /metrics
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-ink-mute">
            {transactions.length} transactions · {categories.length} categories tracked
          </p>
        </motion.div>

        <StatsOverview stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IncomeExpenseChart transactions={transactions} />
          <ExpenseCategories transactions={transactions} categories={categories} />
          <BalanceTrendChart transactions={transactions} />
        </div>

        <TransactionSummary stats={stats} transactions={transactions} />
      </div>
    </DashboardLayout>
  )
}
