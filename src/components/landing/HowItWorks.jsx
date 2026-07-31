import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, PlusCircle, Target, Activity, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'

const steps = [
  {
    icon: UserPlus,
    title: 'Sign up in 90 seconds',
    desc: 'Email only. No credit card, no onboarding quiz, no 14-step wizard.',
  },
  {
    icon: PlusCircle,
    title: 'Drop in a transaction',
    desc: 'Type the amount, pick a category. Flow remembers the rest.',
  },
  {
    icon: Target,
    title: 'Set the ceilings',
    desc: 'Give each category a monthly budget and let the ledger watch.',
  },
  {
    icon: Activity,
    title: 'Watch it move',
    desc: 'Live balances, weekly flow, quiet nudges near the line.',
  },
]

function Connector({ active, vertical = false }) {
  return (
    <div
      className={`relative overflow-hidden ${vertical ? 'h-10 w-px flex-1' : 'mt-7 h-px flex-1'}`}
      style={{ backgroundColor: '#2C2A22' }}
    >
      <motion.div
        className="absolute bg-money-500"
        style={vertical ? { insetInline: 0, top: 0, height: '100%', transformOrigin: 'top' } : { insetBlock: 0, left: 0, width: '100%', transformOrigin: 'left' }}
        initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
        animate={active ? (vertical ? { scaleY: 1 } : { scaleX: 1 }) : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

function StepNode({ step, index, active }) {
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex-1 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border transition-colors duration-300 ${
              active
                ? 'border-money-500 bg-money-500/10 text-money-400'
                : 'border-line bg-canvas-card text-ink-faint'
            }`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <span
            className={`text-[11px] font-pixel tabular transition-colors duration-300 ${
              active ? 'text-money-400' : 'text-ink-faint'
            }`}
          >
            0{index + 1}
          </span>
        </div>
        <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-ink">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-mute">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => {
      setActiveCount((c) => {
        if (c >= steps.length) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 600)
    return () => clearInterval(id)
  }, [inView])

  return (
    <section id="how-it-works" ref={ref} className="relative overflow-hidden border-y border-line bg-canvas-soft/50 py-24 lg:py-32">
      <div aria-hidden className="absolute inset-0 pattern-grid opacity-60" />

      <div className="landing-container relative z-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-[10px] font-pixel uppercase tracking-wide text-money-400">
            [ 02 · the pipeline ]
          </p>
          <h2 className="font-display text-display-sm font-semibold text-ink text-balance">
            From signup to insight in four moves
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-mute">
            No maze. No dashboard that takes a week to learn. Just a straight line from your first
            entry to your first clarity.
          </p>
        </div>

        {/* desktop pipeline */}
        <div className="hidden lg:flex items-start gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-1 items-start gap-6">
              <StepNode step={step} index={i} active={i < activeCount} />
              {i < steps.length - 1 && <Connector active={activeCount > i + 1} />}
            </div>
          ))}
        </div>

        {/* mobile pipeline */}
        <div className="lg:hidden space-y-0">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span
                  className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                    i < activeCount
                      ? 'border-money-500 bg-money-500/10 text-money-400'
                      : 'border-line bg-canvas-card text-ink-faint'
                  }`}
                >
                  <step.icon className="h-6 w-6" />
                </span>
                {i < steps.length - 1 && <Connector active={activeCount > i + 1} vertical />}
              </div>
              <div className="pb-10 pt-3">
                <p
                  className={`mb-2 text-[10px] font-pixel tabular ${
                    i < activeCount ? 'text-money-400' : 'text-ink-faint'
                  }`}
                >
                  0{i + 1}
                </p>
                <h3 className="font-display text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-24 overflow-hidden rounded-2xl border border-line bg-canvas-deep px-6 py-12 text-center sm:px-12"
        >
          <div aria-hidden className="absolute inset-0 pattern-dots opacity-40" />
          <div className="relative">
            <p className="mb-3 text-[10px] font-pixel uppercase tracking-wide text-money-400">
              ready when you are
            </p>
            <h3 className="font-display text-display-sm font-semibold text-ink">
              See where your money actually goes
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-mute">
              Free to set up. Takes ninety seconds. You can export everything the moment you change
              your mind.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="group/btn" onClick={() => (window.location.href = '/signup')}>
                Start the flow
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
