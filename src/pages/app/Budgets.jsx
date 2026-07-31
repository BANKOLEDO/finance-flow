import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, AlertCircle, CheckCircle2, X } from 'lucide-react'
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
    period: 'monthly',
  })

  const budgetData = useMemo(() => {
    return budgets.map((budget) => {
      const category = categories.find((c) => c.id === budget.category_id)

      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const currentSpending = transactions
        .filter((t) => {
          if (t.category_id !== budget.category_id || t.type !== 'expense') return false

          const transactionDate = new Date(t.transaction_date)
          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          )
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const percentage = budget.amount > 0 ? (currentSpending / budget.amount) * 100 : 0
      const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'

      return {
        ...budget,
        categoryName: category?.name || 'Uncategorized',
        categoryColor: category?.color || '#5F5B4D',
        currentSpending,
        percentage: Math.min(percentage, 100),
        status,
      }
    })
  }, [budgets, categories, transactions])

  const availableCategories = useMemo(() => {
    return categories.filter((cat) => !budgets.some((b) => b.category_id === cat.id))
  }, [categories, budgets])

  const addBudget = async (e) => {
    e.preventDefault()
    if (!newBudget.category_id || !newBudget.amount) return

    try {
      const { error } = await supabase.from('budgets').insert([
        {
          ...newBudget,
          user_id: user.id,
          amount: parseFloat(newBudget.amount),
        },
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
      const { error } = await supabase.from('budgets').delete().eq('id', id)

      if (error) throw error
      await refetchBudgets()
    } catch (error) {
      console.error('Error deleting budget:', error)
      alert('Error deleting budget: ' + error.message)
    }
  }

  const budgetStats = useMemo(() => {
    const totalBudget = budgetData.reduce((sum, budget) => sum + budget.amount, 0)
    const totalSpent = budgetData.reduce((sum, budget) => sum + budget.currentSpending, 0)
    const onTrackCount = budgetData.filter((b) => b.status === 'good').length
    const warningCount = budgetData.filter((b) => b.status === 'warning').length
    const exceededCount = budgetData.filter((b) => b.status === 'exceeded').length

    return {
      totalBudget,
      totalSpent,
      onTrackCount,
      warningCount,
      exceededCount,
      overallPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    }
  }, [budgetData])

  const barColor =
    budgetStats.overallPercentage >= 100
      ? 'bg-red-400'
      : budgetStats.overallPercentage >= 80
        ? 'bg-amber-300'
        : 'bg-money-500'

  const statusMeta = {
    good: { icon: CheckCircle2, color: 'text-money-400', label: 'On track' },
    warning: { icon: AlertCircle, color: 'text-amber-300', label: 'Near limit' },
    exceeded: { icon: AlertCircle, color: 'text-red-400', label: 'Over budget' },
  }

  const barColorFor = (status) =>
    status === 'exceeded' ? 'bg-red-400' : status === 'warning' ? 'bg-amber-300' : 'bg-money-500'

  if (loading.budgets || loading.categories) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-money-500 border-t-transparent" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink-faint">
              loading budgets…
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
              /limits
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Budgets
            </h1>
            <p className="mt-2 text-sm text-ink-mute">
              {budgetData.length} budgets · {new Date().toLocaleDateString('en-US', { month: 'long' })} spending
            </p>
          </div>
          <Button
            onClick={() => setIsAddingBudget(true)}
            className="group/btn"
            disabled={availableCategories.length === 0}
          >
            <Plus className="h-4 w-4" />
            Add budget
          </Button>
        </motion.div>

        {/* overall summary */}
        {budgetData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Budget overview</h3>
                  <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                    this month
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-pixel tabular ${
                    budgetStats.overallPercentage >= 100
                      ? 'bg-red-500/10 text-red-400'
                      : budgetStats.overallPercentage >= 80
                        ? 'bg-amber-500/10 text-amber-300'
                        : 'bg-money-500/10 text-money-400'
                  }`}
                >
                  {budgetStats.overallPercentage.toFixed(1)}% used
                </span>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Total budget', value: `$${budgetStats.totalBudget.toFixed(2)}`, color: 'text-ink' },
                  { label: 'Total spent', value: `$${budgetStats.totalSpent.toFixed(2)}`, color: 'text-money-400' },
                  { label: 'Remaining', value: `$${(budgetStats.totalBudget - budgetStats.totalSpent).toFixed(2)}`, color: 'text-ink' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-line bg-canvas-soft p-4">
                    <p className={`font-display text-xl font-semibold tabular sm:text-2xl ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-canvas-deep">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetStats.overallPercentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* add budget modal */}
        <AnimatePresence>
          {isAddingBudget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-deep/80 p-4 backdrop-blur-sm"
              onClick={() => setIsAddingBudget(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-pop"
              >
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">Add new budget</h2>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                      set a spending limit
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingBudget(false)}
                    className="rounded-lg p-1.5 text-ink-mute transition-colors hover:bg-canvas-soft hover:text-ink"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={addBudget} className="space-y-5 p-6">
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={newBudget.category_id}
                      onChange={(e) =>
                        setNewBudget((prev) => ({ ...prev, category_id: e.target.value }))
                      }
                      className="input"
                      required
                    >
                      <option value="">Select a category</option>
                      {availableCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {availableCategories.length === 0 && (
                      <p className="mt-1.5 text-xs text-ink-faint">
                        All categories already have budgets. Create new categories to add more.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={newBudget.amount}
                        onChange={(e) =>
                          setNewBudget((prev) => ({ ...prev, amount: e.target.value }))
                        }
                        className="input tabular"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Period</label>
                      <select
                        value={newBudget.period}
                        onChange={(e) =>
                          setNewBudget((prev) => ({ ...prev, period: e.target.value }))
                        }
                        className="input"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsAddingBudget(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={availableCategories.length === 0}
                    >
                      Add budget
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* budgets grid */}
        {budgetData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-canvas-soft">
                <Target className="h-6 w-6 text-ink-faint" />
              </span>
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">No budgets set</h3>
              <p className="mb-6 max-w-sm text-sm text-ink-mute">
                Create your first budget to start tracking your spending limits.
              </p>
              <Button
                onClick={() => setIsAddingBudget(true)}
                disabled={availableCategories.length === 0}
              >
                Create budget
              </Button>
              {availableCategories.length === 0 && (
                <p className="mt-3 text-xs text-ink-faint">
                  You need to create categories first. Add categories in the categories section.
                </p>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {budgetData.map((budget, index) => {
              const Status = statusMeta[budget.status]
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <Card className="group p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 shrink-0 rounded-[4px]"
                          style={{ backgroundColor: budget.categoryColor }}
                        />
                        <div>
                          <h3 className="font-medium text-ink">{budget.categoryName}</h3>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                            {budget.period}
                          </p>
                        </div>
                      </div>
                      <Status.icon className={`h-5 w-5 ${Status.color}`} />
                    </div>

                    <div className="mb-5 space-y-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-mute">Spent</span>
                        <span className="font-mono font-medium tabular text-ink">
                          ${budget.currentSpending.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-mute">Budget</span>
                        <span className="font-mono font-medium tabular text-ink">
                          ${budget.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-mute">Remaining</span>
                        <span
                          className={`font-mono font-medium tabular ${
                            budget.amount - budget.currentSpending >= 0
                              ? 'text-money-400'
                              : 'text-red-400'
                          }`}
                        >
                          ${(budget.amount - budget.currentSpending).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-mono tabular text-ink-faint">
                          {budget.percentage.toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                          {Status.label}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-canvas-deep">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
                          className={`h-full rounded-full ${barColorFor(budget.status)}`}
                        />
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:border-red-400/40 hover:bg-red-500/5 hover:text-red-400"
                      onClick={() => deleteBudget(budget.id)}
                    >
                      Delete budget
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* status summary */}
        {budgetData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="mb-5">
                <h3 className="font-display text-lg font-semibold text-ink">Budget status</h3>
                <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                  current health
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'On track', value: budgetStats.onTrackCount, color: 'text-money-400', tint: 'bg-money-500/10' },
                  { label: 'Near limit', value: budgetStats.warningCount, color: 'text-amber-300', tint: 'bg-amber-500/10' },
                  { label: 'Exceeded', value: budgetStats.exceededCount, color: 'text-red-400', tint: 'bg-red-500/10' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl border border-line p-4 text-center ${s.tint}`}>
                    <p className={`font-display text-2xl font-semibold tabular ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
