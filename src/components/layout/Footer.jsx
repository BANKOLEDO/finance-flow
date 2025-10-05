import { Github, Twitter, Mail, Shield, Heart } from 'lucide-react'
import Button from '../ui/Button'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Testimonials', href: '#testimonials' },
      { name: 'Pricing', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' }
  ]

  return (
    <footer className=" max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-black text-white pt-4">
      {/* Main Footer Content */}
      <div className="landing-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex justify-center md:justify-start space-x-3 mb-6">
              <img 
                src="/logo/logo-light-transparent.png" 
                alt="Finance Flow" 
                className="h-8 w-auto"
              />
            </div>
            
            <p className="text-gray-400 text-center md:text-left mb-6 leading-relaxed">
              Take control of your financial future with our simple, powerful money tracking tools. 
              Free forever, no hidden costs.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center md:justify-start space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>

            {/* Security Badge */}
            <div className="flex justify-center md:justify-start space-x-2 text-sm text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Bank-level security & encryption</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="flex justify-center mt-12 mb-3 pt-12 border-t border-gray-800">
          <div className="max-w-md w-full">
            <h3 className="font-semibold text-white mb-4 text-center">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm text-center">
              Get the latest features and financial tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button variant="primary" className="whitespace-nowrap w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="landing-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center py-2 space-x-2 text-gray-400 text-sm">
              <span>&copy; {currentYear} Finance Flow. Built with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for the community.</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}