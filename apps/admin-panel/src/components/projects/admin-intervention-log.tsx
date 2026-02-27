'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DataTable,
  Badge,
  Button,
  Spinner,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Textarea,
} from '@glimmora/ui'
import type { AdminIntervention, InterventionType } from '@glimmora/types'
import type { ColumnDef } from '@tanstack/react-table'
import { Shield } from 'lucide-react'

const interventionTypeLabels: Record<InterventionType, { label: string; variant: 'done' | 'normal' | 'inprogress' | 'atrisk' | 'urgent' }> = {
  project_freeze: { label: 'Project Freeze', variant: 'urgent' },
  project_unfreeze: { label: 'Project Unfreeze', variant: 'done' },
  contributor_reassignment: { label: 'Reassignment', variant: 'inprogress' },
  milestone_override: { label: 'Milestone Override', variant: 'atrisk' },
  payment_hold: { label: 'Payment Hold', variant: 'atrisk' },
  payment_release: { label: 'Payment Release', variant: 'done' },
  escalation_created: { label: 'Escalation Created', variant: 'inprogress' },
}

const interventionColumns: ColumnDef<AdminIntervention, unknown>[] = [
  {
    accessorKey: 'performedAt',
    header: 'Timestamp',
    cell: ({ getValue }) => (
      <span className="text-xs font-body text-text-caption">
        {new Date(getValue<string>()).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'interventionType',
    header: 'Type',
    cell: ({ getValue }) => {
      const type = getValue<InterventionType>()
      const config = interventionTypeLabels[type] ?? { label: type, variant: 'normal' as const }
      return <Badge status={config.variant}>{config.label}</Badge>
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body line-clamp-2">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ getValue }) => (
      <span className="text-xs font-body text-text-caption line-clamp-2">
        {getValue<string>() || '--'}
      </span>
    ),
  },
  {
    accessorKey: 'performedBy',
    header: 'Performed By',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
]

interface AdminInterventionLogProps {
  projectId: string
}

export function AdminInterventionLog({ projectId }: AdminInterventionLogProps) {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<InterventionType | ''>('')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')

  const { data: interventions, isLoading, error } = useQuery<AdminIntervention[]>({
    queryKey: ['admin-project-interventions', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/interventions`)
      if (!res.ok) throw new Error('Failed to fetch interventions')
      return res.json()
    },
  })

  const recordMutation = useMutation({
    mutationFn: async (payload: { interventionType: string; reason: string; details?: string }) => {
      const res = await fetch(`/api/admin/projects/${projectId}/interventions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to record intervention')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-project-interventions', projectId] })
      setDialogOpen(false)
      setSelectedType('')
      setReason('')
      setDetails('')
    },
  })

  function handleSubmit() {
    if (!selectedType || !reason.trim()) return
    recordMutation.mutate({
      interventionType: selectedType,
      reason: reason.trim(),
      details: details.trim() || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading interventions..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load interventions. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-text-heading">Admin Interventions</h3>
          <p className="text-sm font-body text-text-caption mt-0.5">
            Immutable log of all administrative actions taken on this project. Records cannot be edited or deleted.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Shield className="h-4 w-4 mr-1.5" />
              Record Intervention
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-semibold text-text-heading">
                Record Intervention
              </DialogTitle>
              <DialogDescription className="text-sm font-body text-text-caption">
                This action will be permanently recorded and cannot be modified or removed.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-body font-medium text-text-heading mb-1">
                  Intervention Type
                </label>
                <Select value={selectedType} onValueChange={(v) => setSelectedType(v as InterventionType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project_freeze">Project Freeze</SelectItem>
                    <SelectItem value="project_unfreeze">Project Unfreeze</SelectItem>
                    <SelectItem value="contributor_reassignment">Contributor Reassignment</SelectItem>
                    <SelectItem value="milestone_override">Milestone Override</SelectItem>
                    <SelectItem value="payment_hold">Payment Hold</SelectItem>
                    <SelectItem value="payment_release">Payment Release</SelectItem>
                    <SelectItem value="escalation_created">Escalation Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-heading mb-1">
                  Reason <span className="text-status-urgent">*</span>
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the reason for this intervention..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-heading mb-1">
                  Details (optional)
                </label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Additional context or notes..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={!selectedType || !reason.trim() || recordMutation.isPending}
              >
                {recordMutation.isPending ? 'Recording...' : 'Record Intervention'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {interventions && interventions.length > 0 ? (
        <DataTable columns={interventionColumns} data={interventions} enableSorting />
      ) : (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-text-disabled mx-auto mb-3" />
          <p className="text-sm font-body text-text-caption">No interventions recorded for this project.</p>
        </div>
      )}
    </div>
  )
}
