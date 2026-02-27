'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@glimmora/ui'
import Link from 'next/link'
import { FileCheck, CreditCard, FileText, ChevronRight } from 'lucide-react'

interface PendingAction {
  id: string
  label: string
  href: string
  type: 'evidence' | 'payment' | 'blueprint'
}

const actionIcons: Record<string, React.ElementType> = {
  evidence: FileCheck,
  payment: CreditCard,
  blueprint: FileText,
}

interface PendingActionsWidgetProps {
  actions: PendingAction[]
}

export function PendingActionsWidget({ actions }: PendingActionsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = actionIcons[action.type] ?? FileText
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-center gap-3 rounded-inner p-3 hover:bg-hover transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                  <Icon className="h-4 w-4 text-brand-primary" />
                </div>
                <span className="text-sm font-body text-text-body flex-1">
                  {action.label}
                </span>
                <ChevronRight className="h-4 w-4 text-text-disabled shrink-0" />
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
