export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) {
  // Base classes that all buttons share
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Different visual styles
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    black: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-black hover:bg-gray-50 focus:ring-gray-500'
  }
  
  // Different sizes - responsive
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg sm:text-xl'
  }
  
  return (
    <button 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}