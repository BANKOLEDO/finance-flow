import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, AlertCircle, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useDataManager } from '../../hooks/useDataManager'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function Budgets() {
  const { transactions, categories, budgets, loading, refetchBudgets } = useDataManager()
  const { user } = useAuth()
  const [isAddingBudget, setIsAddingBudget] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category_id: '',
    amount: '',
    period: 'monthly'
  })

  const budgetData = useMemo(() => {
    return budgets.map(budget => {
      const category = categories.find(c => c.id === budget.category_id)
      
      // Calculate current month's spending for this category
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      const currentSpending = transactions
        .filter(t => {
          if (t.category_id !== budget.category_id || t.type !== 'expense') return false
          
          const transactionDate = new Date(t.transaction_date)
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const percentage = budget.amount > 0 ? (currentSpending / budget.amount) * 100 : 0
      const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'

      return {
        ...budget,
        categoryName: category?.name || 'Uncategorized',
        categoryColor: category?.color || '#6b7280',
        currentSpending,
        percentage: Math.min(percentage, 100), // Cap at 100% for display
        status
      }
    })
  }, [budgets, categories, transactions])

  // FIXED: Get all expense categories that don't have budgets yet
  const availableCategories = useMemo(() => {
    return categories.filter(cat => 
      !budgets.some(b => b.category_id === cat.id)
    )
  }, [categories, budgets])

  const addBudget = async (e) => {
    e.preventDefault()
    if (!newBudget.category_id || !newBudget.amount) return

    try {
      const { error } = await supabase
        .from('budgets')
        .insert([
          {
            ...newBudget,
            user_id: user.id,
            amount: parseFloat(newBudget.amount)
          }
        ])

      if (error) throw error

      await refetchBudgets()
      setIsAddingBudget(false)
      setNewBudget({ category_id: '', amount: '', period: 'monthly' })
    } catch (error) {
      console.error('Error adding budget:', error)
      alert('Error adding budget: ' + error.message)
    }
  }

  const deleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)

      if (error) throw error
      await refetchBudgets()
    } catch (error) {
      console.error('Error deleting budget:', error)
      alert('Error deleting budget: ' + error.message)
    }
  }

  // Budget summary statistics
  const budgetStats = useMemo(() => {
    const totalBudget = budgetData.reduce((sum, budget) => sum + budget.amount, 0)
    const totalSpent = budgetData.reduce((sum, budget) => sum + budget.currentSpending, 0)
    const onTrackCount = budgetData.filter(b => b.status === 'good').length
    const warningCount = budgetData.filter(b => b.status === 'warning').length
    const exceededCount = budgetData.filter(b => b.status === 'exceeded').length

    return {
      totalBudget,
      totalSpent,
      onTrackCount,
      warningCount,
      exceededCount,
      overallPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    }
  }, [budgetData])

  if (loading.budgets || loading.categories) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading budgets...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600 mt-1">Set and track your spending limits</p>
          </div>
          <Button 
            onClick={() => setIsAddingBudget(true)}
            className="flex items-center space-x-2 btn btn-primary"
            disabled={availableCategories.length === 0}
          >
            <Plus className="h-4 w-4" />
            <span>Add Budget</span>
          </Button>
        </motion.div>

        {/* Overall Budget Summary */}
        {budgetData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${budgetStats.totalBudget.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Budget</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">${budgetStats.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ${(budgetStats.totalBudget - budgetStats.totalSpent).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {budgetStats.overallPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Overall Usage</p>
                </div>
              </div>
              
              {/* Overall Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    budgetStats.overallPercentage >= 100 ? 'bg-red-500' :
                    budgetStats.overallPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetStats.overallPercentage, 100)}%` }}
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Add Budget Modal */}
        <AnimatePresence>
          {isAddingBudget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md"
              >
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Budget</h2>
                  <form onSubmit={addBudget} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newBudget.category_id}
                        onChange={(e) => setNewBudget(prev => ({ ...prev, category_id: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {availableCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {availableCategories.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          All categories already have budgets. Create new categories to add more budgets.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Budget Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={newBudget.amount}
                        onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Period
                      </label>
                      <select
                        value={newBudget.period}
                        onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 btn btn-outline"
                        onClick={() => setIsAddingBudget(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 btn btn-primary"
                        disabled={availableCategories.length === 0}
                      >
                        Add Budget
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Budgets Grid */}
        {budgetData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
              <p className="text-gray-500 mb-6">
                Create your first budget to start tracking your spending limits.
              </p>
              <Button 
                onClick={() => setIsAddingBudget(true)}
                className="btn btn-primary"
                disabled={availableCategories.length === 0}
              >
                Create Budget
              </Button>
              {availableCategories.length === 0 && (
                <p className="text-sm text-gray-500 mt-3">
                  You need to create categories first. Add categories in the categories section.
                </p>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {budgetData.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: budget.categoryColor }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{budget.categoryName}</h3>
                        <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {budget.status === 'exceeded' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {budget.status === 'warning' && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {budget.status === 'good' && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent</span>
                      <span className="font-medium">${budget.currentSpending.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium">${budget.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-medium text-green-600">
                        ${(budget.amount - budget.currentSpending).toFixed(2)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            budget.status === 'exceeded' ? 'bg-red-500' :
                            budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{budget.percentage.toFixed(1)}% used</span>
                        <span>
                          {budget.status === 'exceeded' ? 'Over budget' :
                           budget.status === 'warning' ? 'Near limit' : 'On track'}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full btn btn-outline hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => deleteBudget(budget.id)}
                    >
                      Delete Budget
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Budget Status Summary */}
        {budgetData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-600">
                    {budgetStats.onTrackCount}
                  </p>
                  <p className="text-sm text-gray-600">On Track</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-yellow-600">
                    {budgetStats.warningCount}
                  </p>
                  <p className="text-sm text-gray-600">Near Limit</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-600">
                    {budgetStats.exceededCount}
                  </p>
                  <p className="text-sm text-gray-600">Exceeded</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}