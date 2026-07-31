export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-line bg-canvas-card px-4 py-3 shadow-lift">
        <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-ink-faint">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6 py-0.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-ink-mute">{entry.name}:</span>
            </div>
            <span className={`text-xs font-semibold tabular ${
              entry.dataKey === 'balance'
                ? entry.value >= 0 ? 'text-money-400' : 'text-red-400'
                : entry.dataKey === 'expenses' ? 'text-ink' : 'text-money-400'
            }`}>
              ${typeof entry.value === 'number' ? Math.abs(entry.value).toFixed(2) : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}
