import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedNumber from '../ui/AnimatedNumber'
import { images } from '../../lib/images'

const stats = [
  { value: 10000, suffix: '+', label: 'active accounts' },
  { value: 48, prefix: '$', suffix: 'M', label: 'tracked this year' },
  { value: 99.98, decimals: 2, suffix: '%', label: 'uptime' },
  { value: 2, suffix: ' min', label: 'median setup' },
]

const testimonials = [
  {
    quote: 'Finally a finance app that doesn\u2019t scream at me. It sits quietly in the corner of the screen and just works.',
    name: 'Sarah M.',
    role: 'Freelance designer',
    avatar: images.avatarA,
  },
  {
    quote: 'I\u2019ve tried every budget app on the market. This is the first one I haven\u2019t deleted after a week.',
    name: 'Mike R.',
    role: 'Software engineer',
    avatar: images.avatarB,
  },
  {
    quote: 'As a student, tracking expenses used to stress me out. This made it feel like a game of arithmetic I can win.',
    name: 'Jessica T.',
    role: 'Economics student',
    avatar: images.avatarC,
  },
]

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="testimonials" ref={ref} className="relative py-24 lg:py-32">
      <div className="landing-container">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[10px] font-pixel uppercase tracking-wide text-money-400">
            [ 03 · field notes ]
          </p>
          <h2 className="mx-auto max-w-xl font-display text-display-sm font-semibold text-ink text-balance">
            Quiet confidence, loud results
          </h2>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group px-4 lg:border-l lg:border-line lg:first:border-l-0"
            >
              <p className="font-display text-4xl font-bold tabular text-ink transition-colors duration-300 group-hover:text-money-400">
                <AnimatedNumber
                  value={stat.value}
                  decimals={stat.decimals || 0}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix || ''}
                />
              </p>
              <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-mute">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* testimonials */}
        <div className="mt-24 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between rounded-xl border border-line bg-canvas-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-money-500/40 hover:shadow-lift"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-6 top-5 font-pixel text-3xl text-money-500/25 transition-colors duration-300 group-hover:text-money-500/40"
              >
                &ldquo;
              </span>
              <blockquote className="relative text-[15px] leading-relaxed text-ink-soft">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3.5 border-t border-line pt-5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full border border-line object-cover"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink">{t.name}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
                    {t.role}
                  </span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
