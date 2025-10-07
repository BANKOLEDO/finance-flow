import { motion } from 'framer-motion'

export default function TimePeriodFilter({ period, onPeriodChange }) {
  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '1M' },
    { value: '90d', label: '3M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' }
  ]

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {periods.map((p) => (
        <motion.button
          key={p.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPeriodChange(p.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            period === p.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {p.label}
        </motion.button>
      ))}
    </div>
  )
}