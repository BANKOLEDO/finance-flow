import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('')

  const navigation = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How it works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-canvas-deep/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden
        />
      )}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-line shadow-card' : 'bg-transparent'
        }`}
      >
      <div className="landing-container">
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          <a href="#top" className="group flex items-center gap-3" aria-label="Finance Flow home">
            <img
              src="/logo/logo-light-transparent.png"
              alt="Finance Flow"
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline-block h-2 w-2 bg-money-500 animate-blink" />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`group relative text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-200 hover:text-money-400 ${
                  activeId === item.id ? 'text-money-400' : 'text-ink-mute'
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-money-500 transition-transform duration-300 ${
                    activeId === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/login')}>
              Sign in
            </Button>
            <Button size="sm" onClick={() => (window.location.href = '/signup')}>
              Start tracking
            </Button>
          </div>

          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:bg-canvas-soft"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-line bg-canvas-soft/95 backdrop-blur-xl">
          <div className="landing-container py-6 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between py-3 text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-200 hover:text-money-400 ${
                  activeId === item.id ? 'text-money-400' : 'text-ink-mute'
                }`}
              >
                {item.name}
                {activeId === item.id && <span className="h-1.5 w-1.5 rounded-full bg-money-500" />}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-5">
              <Button variant="ghost" className="w-full" onClick={() => (window.location.href = '/login')}>
                Sign in
              </Button>
              <Button className="w-full" onClick={() => (window.location.href = '/signup')}>
                Start tracking
              </Button>
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  )
}
