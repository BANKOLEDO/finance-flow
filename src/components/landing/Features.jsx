import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ReceiptText,
  BarChart3,
  Target,
  ShieldCheck,
  Smartphone,
  Wallet,
  Laptop,
  Tablet,
} from 'lucide-react'
import { images } from '../../lib/images'

const expenseRows = [
  { name: 'Groceries', color: '#22B85F', pct: 62 },
  { name: 'Transport', color: '#E8B33D', pct: 41 },
  { name: 'Coffee', color: '#F4F1E8', pct: 18 },
  { name: 'Rent', color: '#22B85F', pct: 84 },
]

function MiniBars() {
  const bars = [34, 52, 41, 64, 48, 72, 58, 84, 66, 90, 74, 96]
  return (
    <svg viewBox="0 0 220 90" fill="none" className="w-full">
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={i * 18}
          width="11"
          rx="2"
          initial={{ height: 0, y: 90 }}
          whileInView={{ height: h, y: 90 - h }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          fill={i === bars.length - 1 ? '#22B85F' : '#3D392E'}
        />
      ))}
    </svg>
  )
}

function RingProgress() {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
        <circle cx="46" cy="46" r={r} stroke="#3D392E" strokeWidth="7" fill="none" />
        <motion.circle
          cx="46"
          cy="46"
          r={r}
          stroke="#22B85F"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - 0.76) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-lg font-semibold tabular text-ink">76%</p>
        <p className="text-[8px] font-mono uppercase tracking-widest text-ink-faint">budget</p>
      </div>
    </div>
  )
}

function TerminalLog() {
  const lines = [
    { c: 'money', t: '> encrypt(ledger.2026) … ok' },
    { c: 'money', t: '> audit(receipts) … 100% clean' },
    { c: 'ink', t: '> nobody else can see this' },
  ]
  return (
    <div className="w-full rounded-lg border border-line bg-canvas-deep p-3.5 font-mono text-[10px] leading-relaxed">
      {lines.map((l, i) => (
        <p key={i} className={l.c === 'money' ? 'text-money-400' : 'text-ink-faint'}>
          {l.t}
        </p>
      ))}
      <p className="mt-1 text-money-400">
        <span className="text-ink-mute">$</span> <span className="inline-block h-3 w-2 translate-y-0.5 bg-money-500 animate-blink" />
      </p>
    </div>
  )
}

function SyncDevices() {
  const icons = [Laptop, Tablet, Smartphone]
  return (
    <div className="flex items-center justify-between w-full px-2">
      {icons.map((Icon, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-canvas-soft text-money-400">
            <Icon className="h-5 w-5" />
          </span>
          {i < icons.length - 1 && (
            <span className="flex items-center gap-1">
              {[0, 1, 2, 3].map((d) => (
                <span key={d} className="h-1 w-1 rounded-full bg-money-500/60" />
              ))}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function FeatureCell({ index, icon: Icon, title, desc, children, span = '', hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative ${span}`}
    >
      <div
        className={`relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-line bg-canvas-card p-6 shadow-card ${
          hover ? 'transition-all duration-300 hover:-translate-y-1 hover:border-money-500/40 hover:shadow-lift' : ''
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-line/60 transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-start justify-between gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-canvas-soft text-money-400 transition-colors duration-300 group-hover:border-money-500/40">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <span className="text-[10px] font-pixel tabular text-ink-faint transition-colors duration-300 group-hover:text-money-400">
            0{index + 1}
          </span>
        </div>

        <div className="relative mt-8">
          <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{desc}</p>
        </div>

        <div className="relative mt-8">{children}</div>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="features" ref={ref} className="relative py-24 lg:py-32">
      <div className="landing-container">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-[10px] font-pixel uppercase tracking-wide text-money-400">
              [ 01 · the system ]
            </p>
            <h2 className="max-w-xl font-display text-display-sm font-semibold text-ink text-balance">
              One ledger to rule your money
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-mute lg:pb-2">
            Every feature is a single, honest view. Nothing flashes, nothing glows, nothing nags
            you with confetti.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          <FeatureCell
            index={0}
            icon={ReceiptText}
            span="sm:col-span-2 lg:col-span-7"
            title="Expense tracking that keeps receipts honest"
            desc="Categorize in one tap. Finance Flow learns your patterns and pre-fills the next entry before you type it."
          >
            <div className="space-y-2.5 rounded-lg border border-line bg-canvas-soft p-4">
              {expenseRows.map((row, i) => (
                <motion.div
                  key={row.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                  <span className="w-24 text-[11px] font-mono uppercase tracking-wider text-ink-mute">
                    {row.name}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-charcoal-800">
                    <span className="block h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                  </span>
                  <span className="w-12 text-right text-[11px] font-mono tabular text-ink">
                    ${(row.pct * 4.2).toFixed(0)}.00
                  </span>
                </motion.div>
              ))}
            </div>
          </FeatureCell>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-xl border border-line sm:col-span-2 lg:col-span-5"
          >
            <img
              src={images.charts}
              alt="Analytics dashboard on a laptop"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep via-canvas-deep/40 to-transparent" />
            <div className="relative flex h-full min-h-[260px] flex-col justify-end p-6">
              <span className="mb-2 text-[10px] font-pixel uppercase tracking-wide text-money-400">
                visual reports
              </span>
              <p className="font-display text-xl font-semibold text-ink">
                Charts that read like a ledger, not a laser show
              </p>
              <p className="mt-1.5 text-xs font-mono uppercase tracking-widest text-ink-faint">
                fig.02 — the monthly view
              </p>
            </div>
          </motion.div>

          <FeatureCell
            index={2}
            icon={Target}
            span="sm:col-span-2 lg:col-span-5"
            title="Budgets that actually hold"
            desc="Set a ceiling per category. When you cross 80%, we send a polite nudge — not an alarm siren."
          >
            <div className="flex items-center justify-between rounded-lg border border-line bg-canvas-soft p-4">
              <RingProgress />
              <div className="space-y-1.5 text-right">
                <p className="text-[10px] font-mono uppercase tracking-widest text-ink-faint">spent</p>
                <p className="font-display text-lg font-semibold tabular text-ink">$3,190</p>
                <p className="text-[10px] font-mono tabular text-ink-faint">of $4,200</p>
              </div>
            </div>
          </FeatureCell>

          <FeatureCell
            index={3}
            icon={BarChart3}
            span="sm:col-span-2 lg:col-span-7"
            title="Reports without the 3D explosions"
            desc="Income vs expenses, cash flow, category splits — rendered as clean, quiet data you can actually parse."
          >
            <div className="rounded-lg border border-line bg-canvas-soft p-4">
              <MiniBars />
            </div>
          </FeatureCell>

          <FeatureCell
            index={4}
            icon={ShieldCheck}
            span="sm:col-span-1 lg:col-span-4"
            title="Locked down, on purpose"
            desc="Encrypted at rest and in transit. Your numbers are yours."
          >
            <TerminalLog />
          </FeatureCell>

          <FeatureCell
            index={5}
            icon={Smartphone}
            span="sm:col-span-1 lg:col-span-4"
            title="Syncs everywhere"
            desc="Phone, tablet, laptop. Same ledger, all devices."
          >
            <SyncDevices />
          </FeatureCell>

          <FeatureCell
            index={6}
            icon={Wallet}
            span="sm:col-span-2 lg:col-span-4"
            title="Free forever"
            desc="No trials, no paywalls, no surprise pricing."
            hover={false}
          >
            <div className="flex items-center justify-between rounded-lg border border-line bg-canvas-soft px-4 py-3">
              <span className="font-display text-3xl font-bold tabular text-money-400">$0</span>
              <span className="text-[9px] font-pixel uppercase text-ink-faint">/month · forever</span>
            </div>
          </FeatureCell>
        </div>
      </div>
    </section>
  )
}
