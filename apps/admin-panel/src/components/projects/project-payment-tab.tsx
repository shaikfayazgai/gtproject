'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable, Badge, Button, Spinner, Card, CardContent } from '@glimmora/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminPaymentRecord } from '@/lib/msw/factories/project'
import { DollarSign } from 'lucide-react'

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function statusToBadge(status: AdminPaymentRecord['status']): { label: string; variant: 'done' | 'normal' | 'inprogress' } {
  switch (status) {
    case 'released':
      return { label: 'Released', variant: 'done' }
    case 'pending':
      return { label: 'Pending', variant: 'normal' }
    case 'held':
      return { label: 'Held', variant: 'inprogress' }
  }
}

interface ProjectPaymentTabProps {
  projectId: string
}

export function ProjectPaymentTab({ projectId }: ProjectPaymentTabProps) {
  const queryClient = useQueryClient()

  const { data: payments = [], isLoading, error } = useQuery<AdminPaymentRecord[]>({
    queryKey: ['admin-project-payments', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/payments`)
      if (!res.ok) throw new Error('Failed to fetch payments')
      return res.json()
    },
  })

  const releaseHoldMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const res = await fetch(`/api/admin/projects/${projectId}/payments/${paymentId}/release`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to release hold')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-project-payments', projectId] })
    },
  })

  const paymentColumns: ColumnDef<AdminPaymentRecord, unknown>[] = [
    {
      accessorKey: 'milestoneName',
      header: 'Milestone',
      cell: ({ getValue }) => (
        <span className="text-sm font-body font-medium text-text-heading">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-body font-medium">
          {formatCurrency(row.original.amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const { label, variant } = statusToBadge(getValue<AdminPaymentRecord['status']>())
        return <Badge status={variant}>{label}</Badge>
      },
    },
    {
      accessorKey: 'releaseMode',
      header: 'Release Mode',
      cell: ({ getValue }) => (
        <span className="text-xs font-body text-text-caption capitalize">
          {(getValue<string>() || '').replace(/-/g, ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'releasedAt',
      header: 'Date',
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>()
        return (
          <span className="text-xs font-body text-text-caption">
            {v ? new Date(v).toLocaleDateString() : '--'}
          </span>
        )
      },
    },
    {
      accessorKey: 'transactionId',
      header: 'Transaction ID',
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>()
        return (
          <span className="font-mono text-xs text-text-caption">
            {v || '--'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        if (row.original.status !== 'held') return null
        return (
          <Button
            size="sm"
            onClick={() => releaseHoldMutation.mutate(row.original.id)}
            disabled={releaseHoldMutation.isPending}
          >
            Release Hold
          </Button>
        )
      },
      enableSorting: false,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading payments..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load payments. Please try again.
      </div>
    )
  }

  // Calculate summary
  const totalBudget = payments.reduce((sum, p) => sum + p.amount, 0)
  const released = payments.filter((p) => p.status === 'released').reduce((sum, p) => sum + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const held = payments.filter((p) => p.status === 'held').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Payment Release</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Manage payment releases for completed milestones. Admin can release held payments.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Total Budget</p>
            <p className="text-xl font-display font-bold text-text-heading mt-1">
              {formatCurrency(totalBudget)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Released</p>
            <p className="text-xl font-display font-bold text-status-success mt-1">
              {formatCurrency(released)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Pending</p>
            <p className="text-xl font-display font-bold text-text-heading mt-1">
              {formatCurrency(pending)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Held</p>
            <p className="text-xl font-display font-bold text-status-warning mt-1">
              {formatCurrency(held)}
            </p>
          </CardContent>
        </Card>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-text-disabled mx-auto mb-3" />
          <p className="text-sm font-body text-text-caption">No payment records for this project.</p>
        </div>
      ) : (
        <DataTable columns={paymentColumns} data={payments} enableSorting />
      )}
    </div>
  )
}
