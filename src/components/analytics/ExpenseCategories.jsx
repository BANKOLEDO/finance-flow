import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../ui/Card'
import CustomTooltip from './CustomTooltip'

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 25
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.03) return null

  return (
    <text
      x={x}
      y={y}
      fill="#C9C4B2"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: 11, fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ExpenseCategories({ transactions, categories }) {
  const COLORS = ['#22B85F', '#E5533C', '#E8B33D', '#6E9FE8', '#A78BFA', '#22C7CE']

  const categoryData = useMemo(() => {
    const categoryTotals = {}

    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const category = categories.find((c) => c.id === transaction.category_id)
        const categoryName = category?.name || 'Uncategorized'
        categoryTotals[categoryName] =
          (categoryTotals[categoryName] || 0) + parseFloat(transaction.amount)
      }
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions, categories])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-display text-lg font-semibold text-ink">Expense Categories</h3>
          <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">top 6</p>
        </div>

        {categoryData.length === 0 ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-sm font-mono uppercase tracking-widest text-ink-faint">
              no expense data
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: '#5F5B4D', strokeWidth: 1 }}
                    label={CustomPieLabel}
                    outerRadius={72}
                    innerRadius={36}
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

            <div className="space-y-1.5">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition-colors duration-200 hover:border-line hover:bg-canvas-soft"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate text-sm font-medium text-ink-soft">
                      {category.name}
                    </span>
                  </div>
                  <span className="ml-2 font-mono text-sm font-semibold tabular text-ink">
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
