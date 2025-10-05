import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const navigation = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map(item => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      let currentSection = ''
      sections.forEach(section => {
        if (section) {
          const sectionTop = section.offsetTop
          const sectionHeight = section.offsetHeight
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id
          }
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="max-w-7xl mx-6 xl:mx-auto py-3 bg-white border-2 border-gray-200 rounded-md sticky top-4 z-50">
      <div className="landing-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo/logo-dark-transparent.png" alt="Finance Flow Logo" className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`transition-all duration-200 font-medium hover:text-primary-500 ${
                  activeSection === item.id 
                    ? 'text-primary-500 font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
            <Button 
              size="sm"
              variant="black"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block py-2 transition-colors font-medium ${
                    activeSection === item.id 
                      ? 'text-primary-500 font-semibold' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => {
                  window.location.href = '/login'
                  setIsMenuOpen(false)
                }}
              >
                Login
              </Button>
              <Button 
                variant="black"
                className="w-full justify-center"
                onClick={() => {
                  window.location.href = '/signup'
                  setIsMenuOpen(false)
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}