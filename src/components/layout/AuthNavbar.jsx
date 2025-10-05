import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function AuthNavbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <img 
            src="/logo/logo-dark-transparent.png" 
            alt="Finance Flow" 
            className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
          />
          {/* Back to Home - Enhanced */}
          <Link 
            to="/" 
            className="group flex items-center space-x-3 bg-white/90 hover:bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-1"
          >
            <div className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                Home
              </span>
            </div>
          </Link>
        </div>

        {/* Subtle decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
    </nav>
  )
}