export default function Sparkline({ data, color = '#22B85F', width = 96, height = 28, className = '' }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return [x, y]
  })
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${path} L${width},${height} L0,${height} Z`

  return (
    <svg
      width={className ? undefined : width}
      height={className ? undefined : height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={className ? 'none' : 'xMidYMid meet'}
      fill="none"
      className={className}
      aria-hidden
    >
      <path d={area} fill={color} opacity="0.1" />
      <path
        d={path}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
