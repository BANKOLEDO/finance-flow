import { motion } from 'framer-motion'
import { Wallet, CreditCard, TrendingUp, PiggyBank, ArrowDownRight } from 'lucide-react'
import StackedCards from '../ui/StackedCards'
import Button from '../ui/Button'
import { images } from '../../lib/images'

const deckItems = [
  {
    label: 'Balance',
    value: '$12,480.00',
    sub: 'across 4 accounts',
    badge: '01',
    delta: '+4.2%',
    spark: [12, 14, 13, 16, 15, 18, 21],
    icon: Wallet,
    img: images.coins,
  },
  {
    label: 'Spent / Mar',
    value: '$3,210.00',
    sub: 'of $4,200 budget',
    badge: '02',
    delta: '76%',
    spark: [18, 16, 19, 15, 17, 14, 16],
    icon: CreditCard,
    img: images.cards,
    color: '#E8B33D',
  },
  {
    label: 'Income',
    value: '+$6,850.00',
    sub: 'this month',
    badge: '03',
    delta: '+8.1%',
    spark: [10, 12, 11, 14, 16, 15, 19],
    icon: TrendingUp,
    img: images.charts,
  },
  {
    label: 'Saved',
    value: '$9,270.00',
    sub: 'since January',
    badge: '04',
    delta: '+12%',
    spark: [8, 9, 12, 11, 14, 17, 20],
    icon: PiggyBank,
    img: images.notes,
  },
]

const ticker = [
  { type: 'in', label: 'Salary', value: '+2,450.00' },
  { type: 'out', label: 'Coffee', value: '-4.50' },
  { type: 'out', label: 'Rent', value: '-1,200.00' },
  { type: 'in', label: 'Freelance', value: '+640.00' },
  { type: 'out', label: 'Groceries', value: '-86.20' },
  { type: 'in', label: 'Dividends', value: '+12.40' },
  { type: 'out', label: 'Transit', value: '-3.75' },
  { type: 'in', label: 'Refund', value: '+29.99' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-36">
      {/* backdrop */}
      <div aria-hidden className="absolute inset-0 pattern-grid mask-fade-b" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 hidden lg:block select-none font-display text-[16rem] font-bold leading-none tracking-tightest text-ink/[0.04]"
      >
        $$FLOW$$
      </div>

      <div className="landing-container relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
          {/* copy */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.p
              variants={item}
              className="mb-6 inline-flex items-center gap-2 text-[10px] font-pixel uppercase tracking-wide text-money-400"
            >
              <span className="inline-block h-2 w-2 bg-money-500 animate-blink" />
              personal finance · reimagined
            </motion.p>

            <motion.h1
              variants={item}
              className="font-display text-display font-semibold text-ink text-balance"
            >
              Money in motion,
              <span className="block">
                <span className="text-money-400">without</span> the noise.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              A calm, precise tracker for your income, spending and budgets. Built like a ledger,
              designed to be glanced at — not wrestled with.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
              <Button size="lg" className="group/btn" onClick={() => (window.location.href = '/signup')}>
                Start tracking free
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See the system
              </Button>
            </motion.div>

            <motion.div variants={item} className="mt-12 flex items-center gap-8">
              {[
                ['10K+', 'accounts'],
                ['$48M', 'tracked'],
                ['4.9/5', 'rating'],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-display text-xl font-semibold tabular text-ink">{value}</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            {/* fluid flow svg behind */}
            <svg
              aria-hidden
              viewBox="0 0 600 460"
              fill="none"
              className="pointer-events-none absolute -inset-x-10 -top-10 h-[120%] w-[120%] opacity-70"
            >
              <path
                d="M60 400 C 180 360, 200 160, 360 180 S 520 80, 560 40"
                stroke="#22B85F"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                className="animate-marquee-slow"
                style={{ transform: 'none' }}
              />
              <path
                d="M60 430 C 220 420, 300 220, 480 220 S 560 140, 570 120"
                stroke="#F4F1E8"
                strokeOpacity="0.14"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
            </svg>

            <div className="relative h-[360px] sm:h-[400px]">
              {/* unsplash polaroid */}
              <motion.div
                initial={{ opacity: 0, rotate: -8 }}
                animate={{ opacity: 1, rotate: -6 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pointer-events-none absolute -left-6 top-4 hidden w-44 rotate-[-7deg] rounded-lg border border-line bg-canvas-card p-2.5 shadow-lift sm:block"
              >
                <img
                  src={images.ledger}
                  alt="A receipt and calculator on a dark desk"
                  className="aspect-square w-full rounded object-cover"
                  loading="lazy"
                />
                <p className="mt-2 px-1 text-[9px] font-mono uppercase tracking-widest text-ink-faint">
                  fldr · 03.12
                </p>
              </motion.div>

              <StackedCards items={deckItems} className="ml-auto h-full w-full max-w-sm" />

              {/* floating chip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="pointer-events-none absolute -right-2 bottom-2 sm:right-4 flex items-center gap-2 rounded-lg border border-money-500/40 bg-canvas-card px-3 py-2.5 shadow-lift"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-money-500/15">
                  <TrendingUp className="h-3.5 w-3.5 text-money-400" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[9px] font-pixel uppercase tracking-wide text-ink-faint">
                    saved this month
                  </span>
                  <span className="font-display text-sm font-semibold tabular text-money-400">
                    +$1,240.00
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* terminal ticker marquee */}
      <div className="relative mt-20 border-y border-line bg-canvas-soft/60">
        <div className="flex overflow-hidden mask-fade-r">
          <div className="flex w-max animate-marquee items-center gap-10 py-3.5 pr-10">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className={`h-1.5 w-1.5 rounded-full ${t.type === 'in' ? 'bg-money-500' : 'bg-amber-400/80'}`} />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-mute">
                  {t.label}
                </span>
                <span className={`text-[10px] font-mono tabular ${t.type === 'in' ? 'text-money-400' : 'text-amber-300/80'}`}>
                  {t.type === 'in' ? '+' : '-'}
                  {t.value.replace(/[+-]/g, '')}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
