import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'
import TimePeriodFilter from './TimePeriodFilter'
import CustomTooltip from './CustomTooltip'

export default function BalanceTrendChart({ transactions }) {
  const [period, setPeriod] = useState('30d')

  const chartData = useMemo(() => {
    const now = new Date()
    let dataPoints = []

    switch (period) {
      case '7d':
        dataPoints = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (6 - i))
          return date
        })
        break

      case '30d':
        dataPoints = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (29 - i))
          return date
        })
        break

      case '90d':
        dataPoints = Array.from({ length: 13 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (12 - i) * 7)
          return date
        })
        break

      case '1y':
        dataPoints = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now)
          date.setMonth(date.getMonth() - (11 - i))
          return date
        })
        break

      case 'all':
      default: {
        const allMonths = new Set()
        transactions.forEach((t) => {
          const date = new Date(t.transaction_date)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          allMonths.add(monthKey)
        })

        dataPoints = Array.from(allMonths)
          .sort()
          .slice(-12)
          .map((monthKey) => {
            const [year, month] = monthKey.split('-')
            return new Date(parseInt(year), parseInt(month))
          })
      }
    }

    return dataPoints.map((date) => {
      let dateKey, transactionsInPeriod

      switch (period) {
        case '7d':
          dateKey = date.toLocaleDateString('en-US', { weekday: 'short' })
          transactionsInPeriod = transactions.filter((t) => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate.toDateString() === date.toDateString()
          })
          break

        case '30d':
          dateKey = date.getDate().toString()
          transactionsInPeriod = transactions.filter((t) => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate.toDateString() === date.toDateString()
          })
          break

        case '90d': {
          dateKey = `W${Math.ceil(date.getDate() / 7)}`
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)

          transactionsInPeriod = transactions.filter((t) => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate >= weekStart && transactionDate <= weekEnd
          })
          break
        }

        case '1y':
        case 'all':
        default:
          dateKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          transactionsInPeriod = transactions.filter((t) => {
            const transactionDate = new Date(t.transaction_date)
            return (
              transactionDate.getMonth() === date.getMonth() &&
              transactionDate.getFullYear() === date.getFullYear()
            )
          })
      }

      const income = transactionsInPeriod
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const expenses = transactionsInPeriod
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      return {
        name: dateKey,
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        balance: parseFloat((income - expenses).toFixed(2)),
      }
    })
  }, [transactions, period])

  const getXAxisConfig = () => {
    switch (period) {
      case '7d':
        return { tick: { fontSize: 11 } }
      case '30d':
        return { tick: { fontSize: 10 }, interval: 4 }
      case '90d':
        return { tick: { fontSize: 10 }, interval: 3 }
      case '1y':
      case 'all':
      default:
        return { tick: { fontSize: 11 } }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="lg:col-span-2"
    >
      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Balance Trend</h3>
            <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              {period === 'all' ? 'all history' : period === '1y' ? '12 months' : 'rolling'}
            </p>
          </div>
          <TimePeriodFilter period={period} onPeriodChange={setPeriod} />
        </div>

        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 8, left: -14, bottom: 10 }}>
              <CartesianGrid vertical={false} stroke="rgba(244,241,232,0.06)" />
              <XAxis
                dataKey="name"
                {...getXAxisConfig()}
                tick={{ ...getXAxisConfig().tick, fill: '#5F5B4D', fontFamily: 'JetBrains Mono' }}
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(244,241,232,0.12)' }} />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#8C8775', fontFamily: 'JetBrains Mono' }}
                iconType="circle"
                iconSize={7}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#F4F1E8"
                strokeWidth={2}
                name="Balance"
                dot={{ fill: '#F4F1E8', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#22B85F' }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22B85F"
                strokeWidth={1}
                name="Income"
                strokeDasharray="3 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#E5533C"
                strokeWidth={1}
                name="Expenses"
                strokeDasharray="3 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
