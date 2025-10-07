import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../ui/Card'
import CustomTooltip from './CustomTooltip'

// Custom label component for pie chart
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 25
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Only show label if percentage is above 3%
  if (percent < 0.03) return null

  return (
    <text 
      x={x} 
      y={y} 
      fill="#374151"
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ExpenseCategories({ transactions, categories }) {
  const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4']

  const categoryData = useMemo(() => {
    const categoryTotals = {}

    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const category = categories.find(c => c.id === transaction.category_id)
        const categoryName = category?.name || 'Uncategorized'
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + parseFloat(transaction.amount)
      }
    })

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    })).sort((a, b) => b.value - a.value).slice(0, 6)
  }, [transactions, categories])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
        
        {categoryData.length === 0 ? (
          <div className="flex items-center justify-center h-80 text-gray-500">
            No expense data available
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pie Chart */}
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={{
                      stroke: '#9ca3af',
                      strokeWidth: 1
                    }}
                    label={CustomPieLabel}
                    outerRadius={70}
                    innerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend with Full Names */}
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2">
                      ${category.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}