'use client'
import { useState } from 'react'
import {
  Bot,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '../../lib/utils'

type APGActionType =
  | 'task_assigned'
  | 'review_requested'
  | 'milestone_completed'
  | 'risk_detected'
  | 'team_formed'
  | 'payment_triggered'

interface APGAction {
  id: string
  type: APGActionType
  title: string
  description: string
  timestamp: string
  detail?: string
}

interface APGFeedProps {
  actions: APGAction[]
  maxVisible?: number
  className?: string
}

const actionConfig: Record<
  APGActionType,
  { icon: React.ElementType; iconClass: string; bgClass: string }
> = {
  task_assigned: {
    icon: ArrowRight,
    iconClass: 'text-brand-primary',
    bgClass: 'bg-brand-primary/10',
  },
  review_requested: {
    icon: Clock,
    iconClass: 'text-status-inprogress',
    bgClass: 'bg-status-inprogress/10',
  },
  milestone_completed: {
    icon: CheckCircle,
    iconClass: 'text-status-success',
    bgClass: 'bg-status-success/10',
  },
  risk_detected: {
    icon: AlertTriangle,
    iconClass: 'text-status-warning',
    bgClass: 'bg-status-warning/10',
  },
  team_formed: {
    icon: Bot,
    iconClass: 'text-brand-teal',
    bgClass: 'bg-brand-teal/10',
  },
  payment_triggered: {
    icon: CheckCircle,
    iconClass: 'text-brand-gold',
    bgClass: 'bg-brand-gold/10',
  },
}

function ActionItem({ action }: { action: APGAction }) {
  const [expanded, setExpanded] = useState(false)
  const config = actionConfig[action.type]
  const Icon = config.icon

  return (
    <div className="relative pl-10 pb-6 last:pb-0">
      {/* Icon circle on timeline */}
      <div
        className={cn(
          'absolute left-0 flex h-6 w-6 items-center justify-center rounded-full',
          config.bgClass
        )}
      >
        <Icon className={cn('h-3.5 w-3.5', config.iconClass)} />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className="text-sm font-body font-medium text-text-heading">
          {action.title}
        </p>
        <p className="mt-0.5 text-sm font-body text-text-caption">
          {action.description}
        </p>
        <p className="mt-1 text-xs font-body text-text-disabled">
          {action.timestamp}
        </p>

        {/* Expandable detail */}
        {action.detail && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-body font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show details
                </>
              )}
            </button>
            {expanded && (
              <div className="mt-2 ml-1 pl-3 border-l-2 border-border text-xs font-body text-text-caption leading-relaxed">
                {action.detail}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function APGFeed({ actions, maxVisible, className }: APGFeedProps) {
  const visibleActions = maxVisible ? actions.slice(0, maxVisible) : actions

  return (
    <div className={cn('w-full', className)}>
      {/* APG header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal/10">
          <Bot className="h-4 w-4 text-brand-teal" />
        </div>
        <div>
          <p className="text-sm font-body font-semibold text-text-heading">
            APG Activity
          </p>
          <p className="text-xs font-body text-text-caption">
            Autonomous Project Governor
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

        {visibleActions.map((action) => (
          <ActionItem key={action.id} action={action} />
        ))}
      </div>

      {maxVisible && actions.length > maxVisible && (
        <p className="mt-2 pl-10 text-xs font-body text-text-disabled">
          +{actions.length - maxVisible} more actions
        </p>
      )}
    </div>
  )
}
