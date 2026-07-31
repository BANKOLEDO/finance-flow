export default function Card({ children, className = '', interactive = false }) {
  return (
    <div
      className={`
        card
        ${interactive
          ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:border-line-strong hover:shadow-lift'
          : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
