import { motion } from 'framer-motion'

export default function TimePeriodFilter({ period, onPeriodChange }) {
  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '1M' },
    { value: '90d', label: '3M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg border border-line bg-canvas-soft p-1">
      {periods.map((p) => (
        <motion.button
          key={p.value}
          whileTap={{ scale: 0.94 }}
          onClick={() => onPeriodChange(p.value)}
          className={`relative rounded-md px-2.5 py-1.5 text-[10px] font-pixel uppercase tracking-wide transition-colors duration-200 sm:px-3 ${
            period === p.value ? 'text-ink' : 'text-ink-faint hover:text-ink-mute'
          }`}
        >
          {period === p.value && (
            <motion.span
              layoutId="period-pill"
              className="absolute inset-0 rounded-md border border-line bg-canvas-card"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative">{p.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
