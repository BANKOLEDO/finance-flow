import { motion } from 'framer-motion'
import { Receipt, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../ui/Card'

export default function TransactionSummary({ stats, transactions }) {
  const incomeCount = transactions.filter((t) => t.type === 'income').length
  const expenseCount = transactions.filter((t) => t.type === 'expense').length

  const items = [
    { label: 'Total Transactions', value: stats.transactionCount, icon: Receipt, color: 'text-ink' },
    { label: 'Income Transactions', value: incomeCount, icon: TrendingUp, color: 'text-money-400' },
    { label: 'Expense Transactions', value: expenseCount, icon: TrendingDown, color: 'text-amber-300' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-display text-lg font-semibold text-ink">Transaction Summary</h3>
          <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">ledger overview</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-line bg-canvas-soft p-4 transition-colors duration-200 hover:border-money-500/30"
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-canvas-card ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className={`font-display text-2xl font-semibold tabular ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                    {item.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
