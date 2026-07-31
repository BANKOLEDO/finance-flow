import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, CreditCard, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useDataManager } from '../../hooks/useDataManager'
import AddTransaction from '../../components/transactions/AddTransaction'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function Transactions() {
  const { transactions, categories, loading, refetchTransactions } = useDataManager()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  const deleteTransaction = async (id) => {
    if (!window.confirm('Delete this transaction?')) return

    setDeleting(id)
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      await refetchTransactions()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete transaction')
    } finally {
      setDeleting(null)
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'income') return t.type === 'income'
    if (filter === 'expense') return t.type === 'expense'
    return true
  })

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const balance = income - expenses
    return {
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    }
  }, [filteredTransactions])

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || 'Uncategorized'
  const getCategoryColor = (id) => categories.find((c) => c.id === id)?.color || '#5F5B4D'

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expenses' },
  ]

  if (loading.transactions) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-money-500 border-t-transparent" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink-faint">
              loading ledger…
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* header */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
              /ledger
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-ink-mute">
              {transactions.length} entries on record
            </p>
          </div>
          <AddTransaction onTransactionAdded={refetchTransactions} />
        </motion.section>

        {/* summary strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Income',
              value: summary.income,
              icon: TrendingUp,
              color: 'text-money-400',
              tint: 'bg-money-500/10',
              prefix: '+',
            },
            {
              label: 'Expenses',
              value: summary.expenses,
              icon: TrendingDown,
              color: 'text-amber-300',
              tint: 'bg-amber-500/10',
              prefix: '−',
            },
            {
              label: 'Balance',
              value: summary.balance,
              icon: Wallet,
              color: summary.balance >= 0 ? 'text-money-400' : 'text-red-400',
              tint: summary.balance >= 0 ? 'bg-money-500/10' : 'bg-red-500/10',
              prefix: summary.balance >= 0 ? '+' : '−',
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="flex items-center gap-4 rounded-xl border border-line bg-canvas-card p-5 shadow-card"
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-canvas-soft ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint">
                    {stat.label}
                  </p>
                  <p className="font-display text-xl font-semibold tabular text-ink">
                    {stat.prefix}${Math.abs(stat.value).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* filters */}
        <Card className="p-2">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-canvas-soft p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`relative rounded-lg py-2.5 text-xs font-pixel uppercase tracking-wide transition-colors duration-200 ${
                  filter === f.key ? 'text-ink' : 'text-ink-faint hover:text-ink-mute'
                }`}
              >
                {filter === f.key && (
                  <motion.span
                    layoutId="txn-filter"
                    className="absolute inset-0 rounded-lg border border-line bg-canvas-card shadow-card"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {f.label}
                  <span className="ml-2 tabular text-[9px] text-ink-faint">
                    {f.key === 'all'
                      ? transactions.length
                      : transactions.filter((t) => t.type === f.key).length}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* list */}
        <Card className="overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-canvas-soft">
                <CreditCard className="h-5 w-5 text-ink-faint" />
              </span>
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                No transactions found
              </h3>
              <p className="mb-6 text-sm text-ink-mute">
                {transactions.length === 0
                  ? 'Get started by adding your first transaction.'
                  : 'Try changing your filters to see more results.'}
              </p>
              {transactions.length === 0 && <AddTransaction />}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <div className="divide-y divide-line">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.25 }}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-canvas-soft/60 sm:px-6"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <span
                        className="h-3 w-3 shrink-0 rounded-[4px]"
                        style={{ backgroundColor: getCategoryColor(transaction.category_id) }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {transaction.description}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="text-xs text-ink-mute">
                            {getCategoryName(transaction.category_id)}
                          </p>
                          <span className="text-ink-faint">·</span>
                          <p className="text-xs whitespace-nowrap text-ink-faint">
                            {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                      <span
                        className={`font-mono text-sm font-medium tabular sm:text-base ${
                          transaction.type === 'income' ? 'text-money-400' : 'text-ink'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '−'}$
                        {parseFloat(transaction.amount).toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        disabled={deleting === transaction.id}
                        className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        aria-label="Delete transaction"
                      >
                        {deleting === transaction.id ? (
                          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </Card>

        {/* footer */}
        {filteredTransactions.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[10px] font-mono uppercase tracking-widest text-ink-faint"
          >
            showing {filteredTransactions.length} of {transactions.length} transactions
          </motion.p>
        )}
      </div>
    </DashboardLayout>
  )
}
