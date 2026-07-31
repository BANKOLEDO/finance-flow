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
  ResponsiveContainer,
} from 'recharts'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useDataManager } from '../../hooks/useDataManager'
import { useAuth } from '../../contexts/AuthContext'
import { TrendingUp, TrendingDown, Wallet, Target, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Sparkline from '../../components/ui/Sparkline'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-canvas-card px-3 py-2 shadow-lift">
      <p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-ink-faint">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-2 text-sm tabular text-ink">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          ${entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { transactions, categories, loading } = useDataManager()
  const { profile } = useAuth()

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthTx = transactions.filter((t) => {
      const d = new Date(t.transaction_date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0)
    const expenses = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0)

    return {
      balance: income - expenses,
      income,
      expenses,
      count: monthTx.length,
    }
  }, [transactions])

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d
    })
    return days.map((date) => {
      const dayTx = transactions.filter(
        (t) => new Date(t.transaction_date).toDateString() === date.toDateString()
      )
      const expenses = dayTx
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + parseFloat(t.amount), 0)
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        expenses: parseFloat(expenses.toFixed(2)),
      }
    })
  }, [transactions])

  const recentTransactions = transactions.slice(0, 6)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  const statCards = [
    {
      label: 'Balance',
      value: stats.balance,
      icon: Wallet,
      delta: stats.balance >= 0 ? '+2.4%' : '-1.2%',
      up: stats.balance >= 0,
      spark: [14, 16, 15, 18, 17, 20, 22],
    },
    {
      label: 'Income',
      value: stats.income,
      icon: TrendingUp,
      delta: '+8.1%',
      up: true,
      spark: [10, 12, 11, 14, 16, 15, 19],
    },
    {
      label: 'Expenses',
      value: stats.expenses,
      icon: TrendingDown,
      delta: stats.expenses > 0 ? '-3.2%' : '—',
      up: false,
      spark: [18, 16, 19, 15, 17, 14, 16],
      color: '#E8B33D',
    },
    {
      label: 'Active categories',
      value: categories.filter((c) => c.is_active).length,
      icon: Target,
      delta: `${categories.length} total`,
      up: true,
      spark: [12, 13, 12, 14, 13, 15, 15],
      isCount: true,
    },
  ]

  if (loading.transactions || loading.categories) {
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
        {/* greeting */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
              good {greeting}, {firstName}
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Here&rsquo;s the state of things.
            </h1>
            <p className="mt-2 text-sm text-ink-mute">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <Link to="/dashboard/transactions">
            <Button size="lg" className="group/btn">
              <Plus className="h-4 w-4" />
              Add transaction
            </Button>
          </Link>
        </motion.section>

        {/* stat ledger cards — tilt on hover */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            const isMoney = !stat.isCount
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              >
                <motion.div
                  whileHover={{ rotate: i % 2 === 0 ? -1.2 : 1.2, y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-xl border border-line bg-canvas-card p-5 shadow-card transition-colors duration-300 hover:border-money-500/40"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-line/60 transition-all duration-500 group-hover:border-money-500/30 group-hover:scale-125"
                  />
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-canvas-soft text-money-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-pixel tabular ${
                        stat.up ? 'bg-money-500/10 text-money-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {stat.up && !stat.isCount ? <ArrowUpRight className="h-3 w-3" /> : null}
                      {!stat.up && !stat.isCount ? <ArrowDownRight className="h-3 w-3" /> : null}
                      {stat.delta}
                    </span>
                  </div>

                  <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-semibold tabular tracking-tight text-ink">
                    {isMoney
                      ? `$${Math.abs(stat.value).toFixed(2)}`
                      : stat.value}
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <Sparkline data={stat.spark} color={stat.color || '#22B85F'} width={72} height={22} />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-ink-faint">
                      {stat.label === 'Balance' ? 'net' : stat.label === 'Active categories' ? 'live' : 'this month'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* recent transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">Recent transactions</h2>
                  <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                    latest entries
                  </p>
                </div>
                <Link to="/dashboard/transactions">
                  <Button variant="outline" size="sm">
                    View all
                  </Button>
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="py-14 text-center">
                  <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-canvas-soft">
                    <Wallet className="h-5 w-5 text-ink-faint" />
                  </span>
                  <p className="text-sm text-ink-mute">No transactions yet. Start the ledger.</p>
                  <Link to="/dashboard/transactions" className="mt-5 inline-block">
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                      Add your first transaction
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {recentTransactions.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                          style={{ backgroundColor: t.categories?.color || '#5F5B4D' }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">
                            {t.description}
                          </p>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                            {t.categories?.name} ·{' '}
                            {new Date(t.transaction_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 font-mono text-sm font-medium tabular ${
                          t.type === 'income' ? 'text-money-400' : 'text-ink'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '−'}${t.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* right column */}
          <div className="space-y-6">
            {/* weekly spending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">Weekly spending</h2>
                    <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                      last 7 days
                    </p>
                  </div>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 6, right: 0, left: -22, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="rgba(244,241,232,0.06)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#5F5B4D', fontFamily: 'JetBrains Mono' }}
                        dy={6}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#5F5B4D', fontFamily: 'JetBrains Mono' }}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(244,241,232,0.04)' }} />
                      <Bar dataKey="expenses" fill="#22B85F" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* quick actions + month summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-ink">Quick actions</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Add transaction', href: '/dashboard/transactions' },
                    { label: 'Set budgets', href: '/dashboard/budgets' },
                    { label: 'View analytics', href: '/dashboard/analytics' },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="group flex items-center justify-between rounded-lg border border-line bg-canvas-soft px-4 py-3 text-sm font-medium text-ink-soft transition-all duration-200 hover:border-money-500/40 hover:text-ink"
                    >
                      {action.label}
                      <ArrowUpRight className="h-4 w-4 text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-money-400" />
                    </Link>
                  ))}
                </div>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="mb-3 text-[10px] font-pixel uppercase tracking-wide text-ink-faint">
                    this month
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-line bg-canvas-soft p-3">
                      <p className="font-display text-xl font-semibold tabular text-ink">{stats.count}</p>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                        transactions
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-canvas-soft p-3">
                      <p className="font-display text-xl font-semibold tabular text-ink">
                        {categories.filter((c) => c.is_active).length}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                        categories
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
