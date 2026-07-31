import { Github, Twitter, Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import Button from '../ui/Button'

const supportLinks = ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service']

const socials = [
  { icon: Github, href: 'https://github.com/BANKOLEDO', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/dev_olabanks', label: 'Twitter' },
  { icon: Mail, href: 'mailto:bankydavid12@gmail.com', label: 'Email' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-deep">
      <div aria-hidden className="absolute inset-0 pattern-grid opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none font-pixel text-[9rem] leading-none text-ink/[0.03] sm:text-[14rem]"
      >
        FLOW
      </div>

      <div className="landing-container relative z-10">
        <div className="grid gap-14 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* brand + newsletter */}
          <div className="lg:col-span-7">
            <img
              src="/logo/logo-light-transparent.png"
              alt="Finance Flow"
              className="h-8 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-mute">
              A calm, precise personal finance tracker. Take control of your money without the
              noise — free forever, no hidden costs.
            </p>

            <div className="mt-8 flex max-w-md items-center gap-2 rounded-xl border border-line bg-canvas-soft p-1.5">
              <input
                type="email"
                placeholder="you@example.com"
                aria-label="Email for updates"
                className="w-full bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <Button size="sm" className="shrink-0" arrow>
                Subscribe
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-ink-faint">
              <ShieldCheck className="h-4 w-4 text-money-500" />
              <span className="font-mono uppercase tracking-wider">
                bank-level encryption · zero trackers
              </span>
            </div>
          </div>

          {/* support links */}
          <div className="lg:col-span-5">
            <p className="mb-5 text-[10px] font-pixel uppercase tracking-wide text-money-400">
              Support
            </p>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#top"
                    className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 sm:flex-row">
          <p className="text-xs font-mono uppercase tracking-wider text-ink-faint">
            &copy; {year} Finance Flow. Built with <Heart className="inline h-3.5 w-3.5 text-red-400" /> by Dev Olabanks.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-canvas-soft text-ink-mute transition-all duration-200 hover:border-money-500/50 hover:text-money-400"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
