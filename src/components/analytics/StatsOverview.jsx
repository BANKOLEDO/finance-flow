// src/components/analytics/StatsOverview.jsx
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import Card from '../ui/Card'

export default function StatsOverview({ stats }) {
  const statItems = [
    { label: 'Total Income', value: stats.totalIncome, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Expenses', value: stats.totalExpenses, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Net Worth', value: stats.netWorth, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg Transaction', value: stats.avgTransaction, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                  ${stat.value.toFixed(2)}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}