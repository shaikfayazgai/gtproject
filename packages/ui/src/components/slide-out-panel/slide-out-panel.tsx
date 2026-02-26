'use client'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SlideOutPanelProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function SlideOutPanel({ open, onClose, title, children, className }: SlideOutPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed right-0 top-0 h-full w-[380px] bg-bg-card border-l border-border shadow-card-hover z-50 flex flex-col',
              className
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              {title && <h2 className="text-lg font-display font-semibold text-text-heading">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto text-text-caption hover:text-text-body transition-colors"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
