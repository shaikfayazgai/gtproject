'use client'
import { unstable_OneTimePasswordField as OneTimePasswordField } from 'radix-ui'
import { cn } from '../../lib/utils'

interface OTPInputProps {
  length?: number
  onComplete?: (value: string) => void
  className?: string
}

export function OTPInput({ length = 6, onComplete, className }: OTPInputProps) {
  return (
    <OneTimePasswordField.Root
      validationType="numeric"
      onValueChange={(value: string) => {
        if (value.length === length) {
          onComplete?.(value)
        }
      }}
      className={cn('flex gap-2', className)}
    >
      {Array.from({ length }).map((_, i) => (
        <OneTimePasswordField.Input
          key={i}
          className={cn(
            'h-12 w-10 rounded-inner border border-border bg-bg-card text-center',
            'text-lg font-mono text-text-heading',
            'focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
            'outline-none transition-colors'
          )}
        />
      ))}
      <OneTimePasswordField.HiddenInput />
    </OneTimePasswordField.Root>
  )
}
