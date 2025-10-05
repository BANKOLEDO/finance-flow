import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useDataManager } from '../../hooks/useDataManager'
import { useAuth } from '../../contexts/AuthContext'
import { TrendingUp, TrendingDown, Wallet, Target, CreditCard, Plus, BarChart3 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function Dashboard() {
  const { transactions, categories, loading } = useDataManager()
  const { profile } = useAuth()

  // Calculate stats
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.transaction_date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    return {
      balance: totalIncome - totalExpenses,
      income: totalIncome,
      expenses: totalExpenses,
      transactionCount: currentMonthTransactions.length
    }
  }, [transactions])

  // Chart data for weekly spending
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date
    }).reverse()

    return last7Days.map(date => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dayTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date)
        return transactionDate.toDateString() === date.toDateString()
      })

      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      return {
        name: dayName,
        expenses: parseFloat(expenses.toFixed(2))
      }
    })
  }, [transactions])

  const recentTransactions = transactions.slice(0, 5)

  if (loading.transactions || loading.categories) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
        >
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-primary-100 text-sm sm:text-base">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { 
              label: 'Balance', 
              value: stats.balance, 
              icon: Wallet, 
              color: 'text-green-600', 
              bg: 'bg-green-100',
              trend: stats.balance >= 0 ? 'positive' : 'negative'
            },
            { 
              label: 'Income', 
              value: stats.income, 
              icon: TrendingUp, 
              color: 'text-blue-600', 
              bg: 'bg-blue-100',
              trend: 'positive'
            },
            { 
              label: 'Expenses', 
              value: stats.expenses, 
              icon: TrendingDown, 
              color: 'text-red-600', 
              bg: 'bg-red-100',
              trend: 'negative'
            },
            { 
              label: 'Categories', 
              value: categories.filter(c => c.is_active).length, 
              icon: Target, 
              color: 'text-purple-600', 
              bg: 'bg-purple-100',
              trend: 'neutral'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${stat.color}`}>
                      {stat.label === 'Categories' ? stat.value : `$${stat.value.toFixed(2)}`}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-4 ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link to="/dashboard/transactions">
                  <Button variant="outline" size="sm" className="btn btn-outline">
                    View All
                  </Button>
                </Link>
              </div>
              
              {recentTransactions.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 mb-4 text-sm sm:text-base">No transactions yet</p>
                  <Link to="/dashboard/transactions">
                    <Button size="sm" className="btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Transaction
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-w-full overflow-hidden">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg min-w-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: transaction.categories?.color || '#6b7280' }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                              {transaction.description}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {transaction.categories?.name}
                            </p>
                          </div>
                        </div>
                        <div className={`font-semibold text-sm sm:text-base whitespace-nowrap flex-shrink-0 ml-3 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions & Weekly Chart */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex flex-col items-start py-2 gap-4">
                  <Link to="/dashboard/transactions">
                    <Button className="w-[17rem] mx-auto flex items-center py-3 justify-start btn btn-outline gap-3">
                      <Plus className="h-4 w-4 mr-6" />
                      Add Transaction
                    </Button>
                  </Link>
                  <Link to="/dashboard/budgets">
                    <Button className="w-[17rem] mx-auto flex items-center py-3 justify-start btn btn-outline gap-3">
                      <Target className="h-4 w-4 mr-6" />
                      Set Budgets
                    </Button>
                  </Link>
                  <Link to="/dashboard/analytics">
                    <Button className="w-[17rem] mx-auto flex items-center py-3 justify-start btn btn-outline">
                      <BarChart3 className="h-4 w-4 mr-10" />
                      View Reports
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">This Month</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions</span>
                      <span className="font-medium">{stats.transactionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Categories</span>
                      <span className="font-medium">
                        {categories.filter(c => c.is_active).length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Weekly Spending Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Spending</h3>
                <div className="h-40 sm:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Spent']}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="expenses" 
                        fill="#ef4444" 
                        radius={[4, 4, 0, 0]}
                        name="Spent"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}