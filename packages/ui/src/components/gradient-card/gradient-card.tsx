'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const gradientCardVariants = cva(
  'rounded-card p-6 text-white shadow-card',
  {
    variants: {
      gradient: {
        primary: 'bg-gradient-to-r from-brand-primary to-brand-gold',
        nature: 'bg-gradient-to-r from-brand-forest to-brand-teal',
      },
    },
    defaultVariants: { gradient: 'primary' },
  }
)

interface GradientCardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof gradientCardVariants> {}

export const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, ...props }, ref) => (
    <div ref={ref} className={cn(gradientCardVariants({ gradient }), className)} {...props} />
  )
)
GradientCard.displayName = 'GradientCard'

export { gradientCardVariants }
