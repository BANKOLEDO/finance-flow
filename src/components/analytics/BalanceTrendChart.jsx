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
        // Last 7 days
        dataPoints = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (6 - i))
          return date
        })
        break
      
      case '30d':
        // Last 30 days
        dataPoints = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (29 - i))
          return date
        })
        break
      
      case '90d':
        // Last 3 months by week
        dataPoints = Array.from({ length: 13 }, (_, i) => {
          const date = new Date(now)
          date.setDate(date.getDate() - (12 - i) * 7)
          return date
        })
        break
      
      case '1y':
        // Last 12 months
        dataPoints = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now)
          date.setMonth(date.getMonth() - (11 - i))
          return date
        })
        break
      
      case 'all':
      default:
        // All available data grouped by month
        const allMonths = new Set()
        transactions.forEach(t => {
          const date = new Date(t.transaction_date)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          allMonths.add(monthKey)
        })
        
        dataPoints = Array.from(allMonths)
          .sort()
          .slice(-12) // Last 12 months
          .map(monthKey => {
            const [year, month] = monthKey.split('-')
            return new Date(parseInt(year), parseInt(month))
          })
        break
    }

    return dataPoints.map(date => {
      let dateKey, transactionsInPeriod

      switch (period) {
        case '7d':
          dateKey = date.toLocaleDateString('en-US', { weekday: 'short' })
          transactionsInPeriod = transactions.filter(t => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate.toDateString() === date.toDateString()
          })
          break
        
        case '30d':
          dateKey = date.getDate().toString()
          transactionsInPeriod = transactions.filter(t => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate.toDateString() === date.toDateString()
          })
          break
        
        case '90d':
          dateKey = `W${Math.ceil(date.getDate() / 7)}`
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          
          transactionsInPeriod = transactions.filter(t => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate >= weekStart && transactionDate <= weekEnd
          })
          break
        
        case '1y':
        case 'all':
        default:
          dateKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          transactionsInPeriod = transactions.filter(t => {
            const transactionDate = new Date(t.transaction_date)
            return transactionDate.getMonth() === date.getMonth() && 
                   transactionDate.getFullYear() === date.getFullYear()
          })
          break
      }

      const income = transactionsInPeriod
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const expenses = transactionsInPeriod
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      return {
        name: dateKey,
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        balance: parseFloat((income - expenses).toFixed(2))
      }
    })
  }, [transactions, period])

  const getXAxisConfig = () => {
    switch (period) {
      case '7d':
        return { tick: { fontSize: 11 } }
      case '30d':
        return { 
          tick: { fontSize: 10 },
          interval: 4 // Show every 4th day
        }
      case '90d':
        return { 
          tick: { fontSize: 10 },
          interval: 3 // Show every 3rd week
        }
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
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Balance Trend</h3>
          <TimePeriodFilter period={period} onPeriodChange={setPeriod} />
        </div>
        
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                {...getXAxisConfig()}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Balance"
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#22c55e" 
                strokeWidth={1}
                name="Income"
                strokeDasharray="3 3"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
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