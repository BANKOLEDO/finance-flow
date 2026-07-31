import { ArrowUpRight } from 'lucide-react'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  arrow = false,
  ...props
}) {
  const variantClasses = {
    primary: 'btn btn-primary',
    light: 'btn btn-light',
    outline: 'btn btn-outline',
    ghost: 'btn btn-ghost',
    black: 'btn btn-light',
    white: 'btn btn-light',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-sm',
  }

  return (
    <button
      className={`
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      )}
    </button>
  )
}
