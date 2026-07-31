import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sparkline from './Sparkline'

function SlipCard({ item }) {
  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-line bg-canvas-card p-4 shadow-card">
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg">
        <img
          src={item.img}
          alt={item.label}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-card via-canvas-card/20 to-transparent" />
        <span className="absolute right-2 top-2 rounded-md border border-money-500/30 bg-canvas-deep/80 px-1.5 py-0.5 text-[9px] font-pixel text-money-400">
          {item.badge}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-canvas-soft">
          <item.icon className="h-3.5 w-3.5 text-money-400" />
        </span>
        <span className="text-[10px] font-pixel uppercase tracking-wide text-ink-mute">
          {item.label}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-display text-2xl font-semibold tracking-tight text-ink tabular">
          {item.value}
        </p>
        <span className="shrink-0 rounded-md border border-money-500/30 bg-money-500/10 px-2 py-0.5 text-[10px] font-pixel tabular text-money-400">
          {item.delta}
        </span>
      </div>

      <div className="mt-auto pt-4">
        <Sparkline data={item.spark} color={item.color || '#22B85F'} className="h-16 w-full" />
      </div>
    </div>
  )
}

export default function StackedCards({ items, className = '' }) {
  const [isTouch] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches
  )
  const [isMobile, setIsMobile] = useState(false)
  const [fan, setFan] = useState(false)
  const [front, setFront] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [spacing, setSpacing] = useState(88)
  const [active, setActive] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [step, setStep] = useState(0)
  const center = (items.length - 1) / 2
  const trackRef = useRef(null)
  const drag = useRef({ down: false, startX: 0 })
  const suppressClick = useRef(false)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setIsMobile(w < 640)
      setSpacing(w < 480 ? 52 : w < 768 ? 72 : 88)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track || !track.firstElementChild) return
      setStep(track.firstElementChild.offsetWidth + 12)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const flipTo = (i) => setActive(((i % items.length) + items.length) % items.length)

  const handleTrackPointerDown = (e) => {
    suppressClick.current = false
    drag.current = { down: true, startX: e.clientX }
    setIsDragging(true)
  }

  const handleTrackPointerMove = (e) => {
    if (!drag.current.down) return
    setDragX(e.clientX - drag.current.startX)
  }

  const handleTrackPointerUp = (e) => {
    if (!drag.current.down) return
    const moved = e.clientX - drag.current.startX
    drag.current.down = false
    if (Math.abs(moved) > 8) suppressClick.current = true
    if (Math.abs(moved) > 24 && step > 0) {
      const next = Math.round((active * step - moved) / step)
      setActive(((next % items.length) + items.length) % items.length)
    }
    setDragX(0)
    setIsDragging(false)
  }

  const handleCardClick = (index) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (isTouch) {
      setFront((front + 1) % items.length)
      return
    }
    if (!fan) {
      setFront(index)
      setFan(true)
      setPinned(true)
      return
    }
    if (index === front) {
      setFan(false)
      setPinned(false)
    } else {
      setFront(index)
      setFan(true)
      setPinned(true)
    }
  }

  if (isMobile) {
    const offset = -(active * step) + (isDragging ? dragX : 0)

    return (
      <div className={`relative select-none ${className}`}>
        <div aria-hidden className="absolute inset-0 pattern-dots opacity-60" />
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={trackRef}
            className={`flex h-full gap-3 ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
            style={{ transform: `translateX(${offset}px)`, touchAction: 'pan-y' }}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={handleTrackPointerUp}
            onPointerCancel={handleTrackPointerUp}
            onPointerLeave={handleTrackPointerUp}
          >
            {items.map((item, index) => (
              <div
                key={item.label}
                className="h-full w-[82%] shrink-0"
                onClick={() => {
                  if (suppressClick.current) {
                    suppressClick.current = false
                    return
                  }
                  flipTo(active + 1)
                }}
              >
                <SlipCard item={item} />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: -20 }}
          className="pointer-events-none absolute -top-8 right-0 rounded-lg border border-money-500/40 bg-money-500/10 px-3 py-2 text-[10px] font-pixel text-money-400 shadow-card"
        >
          LIVE SYNC
        </motion.div>

        <p className="pointer-events-none absolute -bottom-7 left-1 text-[10px] font-pixel uppercase tracking-wide text-ink-faint">
          swipe or tap to flip
        </p>
        <div className="absolute -bottom-7 right-1 flex items-center gap-1.5">
          <button
            aria-label="Previous card"
            onClick={() => flipTo(active - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-canvas-card text-ink-mute shadow-card transition-colors hover:border-money-500/50 hover:text-money-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next card"
            onClick={() => flipTo(active + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-canvas-card text-ink-mute shadow-card transition-colors hover:border-money-500/50 hover:text-money-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={!isTouch ? () => setFan(true) : undefined}
      onMouseLeave={
        !isTouch
          ? () => {
              if (!pinned) setFan(false)
            }
          : undefined
      }
    >
      <div aria-hidden className="absolute inset-0 pattern-dots opacity-60" />
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          className="absolute inset-0"
          style={{ zIndex: index === front ? 40 : items.length - index }}
          animate={{
            x: fan ? (index - center) * spacing : (index - center) * 8,
            y: fan ? 0 : index * 5,
            rotate: fan ? (index - center) * -6 : (index - center) * -1.6,
          }}
          whileHover={{ zIndex: 60, y: fan ? -12 : -6 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          onClick={() => handleCardClick(index)}
        >
          <SlipCard item={item} />
        </motion.div>
      ))}

      <motion.div
        animate={fan ? { opacity: 1, y: -20 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute -top-8 right-0 rounded-lg border border-money-500/40 bg-money-500/10 px-3 py-2 text-[10px] font-pixel text-money-400 shadow-card"
      >
        LIVE SYNC
      </motion.div>

      <p className="pointer-events-none absolute -bottom-7 left-1 text-[10px] font-pixel uppercase tracking-wide text-ink-faint">
        hover to fan · click to pin
      </p>
    </div>
  )
}
