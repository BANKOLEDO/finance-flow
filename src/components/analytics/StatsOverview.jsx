import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react'
import Card from '../ui/Card'

export default function StatsOverview({ stats }) {
  const statItems = [
    {
      label: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'text-money-400',
      tint: 'bg-money-500/10',
    },
    {
      label: 'Total Expenses',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: 'text-amber-300',
      tint: 'bg-amber-500/10',
    },
    {
      label: 'Net Worth',
      value: stats.netWorth,
      icon: Wallet,
      color: stats.netWorth >= 0 ? 'text-money-400' : 'text-red-400',
      tint: stats.netWorth >= 0 ? 'bg-money-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Avg Transaction',
      value: stats.avgTransaction,
      icon: Receipt,
      color: 'text-ink',
      tint: 'bg-canvas-soft',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint">
                    {stat.label}
                  </p>
                  <p className={`font-display text-xl font-semibold tabular sm:text-2xl ${stat.color}`}>
                    ${stat.value.toFixed(2)}
                  </p>
                </div>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line ${stat.tint} ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
