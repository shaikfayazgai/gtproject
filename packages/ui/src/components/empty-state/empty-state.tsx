'use client'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && <div className="mb-4 text-text-disabled">{icon}</div>}
      <h3 className="text-lg font-display font-semibold text-text-heading">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm font-body text-text-caption">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
