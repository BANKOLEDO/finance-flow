import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'
import CustomTooltip from './CustomTooltip'

export default function IncomeExpenseChart({ transactions }) {
  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return date
    }).reverse()

    return last6Months.map((date) => {
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.transaction_date)
        return (
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        )
      })

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      return {
        name: monthKey,
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        balance: parseFloat((income - expenses).toFixed(2)),
      }
    })
  }, [transactions])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-display text-lg font-semibold text-ink">Income vs Expenses</h3>
          <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">last 6 months</p>
        </div>
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 8, left: -14, bottom: 10 }}>
              <CartesianGrid vertical={false} stroke="rgba(244,241,232,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#5F5B4D', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#5F5B4D', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,241,232,0.04)' }} />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#8C8775', fontFamily: 'JetBrains Mono' }}
                iconType="circle"
                iconSize={7}
              />
              <Bar dataKey="income" fill="#22B85F" name="Income" radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="expenses" fill="#E5533C" name="Expenses" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
