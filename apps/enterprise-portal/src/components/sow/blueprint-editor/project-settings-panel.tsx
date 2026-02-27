'use client'
import { useState } from 'react'
import { TextInput, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@glimmora/ui'
import { cn } from '@glimmora/ui'
import type { Blueprint, PaymentReleaseMode } from '@glimmora/types'
import { useEditorStore } from '@/store/editor-store'

interface ProjectSettingsPanelProps {
  blueprint: Blueprint
}

const PAYMENT_TRIGGER_LABELS: Record<PaymentReleaseMode, string> = {
  'manual': 'Manual Release',
  'auto-on-approval': 'Auto on Approval',
  'apg-silent': 'APG Silent Release',
}

export function ProjectSettingsPanel({ blueprint }: ProjectSettingsPanelProps) {
  const selectedMilestoneId = useEditorStore((s) => s.selectedMilestoneId)
  const markDirty = useEditorStore((s) => s.markDirty)

  const [projectName, setProjectName] = useState(blueprint.projectName)

  function handleProjectNameChange(value: string) {
    setProjectName(value)
    markDirty()
  }

  // Show selected milestone first, then all others
  const selectedMilestone = selectedMilestoneId
    ? blueprint.milestones.find((m) => m.id === selectedMilestoneId)
    : null

  const otherMilestones = blueprint.milestones.filter(
    (m) => m.id !== selectedMilestoneId
  )

  const milestonesToShow = selectedMilestone
    ? [selectedMilestone, ...otherMilestones]
    : blueprint.milestones

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-sm font-heading font-semibold text-text-heading mb-4">
        Project Settings
      </h2>

      {/* Project-level settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="project-name" className="block text-xs font-body font-medium text-text-caption mb-1">
            Project Name
          </label>
          <TextInput
            id="project-name"
            value={projectName}
            onChange={(e) => handleProjectNameChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-body font-medium text-text-caption mb-1">
              Total Budget
            </label>
            <p className="text-sm font-body font-semibold text-text-heading">
              ${blueprint.totalBudget.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-text-caption mb-1">
              Timeline
            </label>
            <p className="text-xs font-body text-text-body">
              {blueprint.timeline.startDate} to {blueprint.timeline.endDate}
            </p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-border mb-4" />

      {/* Per-milestone settings */}
      <h3 className="text-xs font-body font-medium text-text-caption uppercase tracking-wider mb-3">
        Milestone Settings
      </h3>

      <div className="space-y-4">
        {milestonesToShow.map((milestone) => {
          const isHighlighted = selectedMilestoneId === milestone.id
          return (
            <MilestoneSettingsCard
              key={milestone.id}
              milestone={milestone}
              isHighlighted={isHighlighted}
              onDirty={markDirty}
            />
          )
        })}
      </div>
    </div>
  )
}

interface MilestoneSettingsCardProps {
  milestone: Blueprint['milestones'][number]
  isHighlighted: boolean
  onDirty: () => void
}

function MilestoneSettingsCard({ milestone, isHighlighted, onDirty }: MilestoneSettingsCardProps) {
  const [budgetAllocation, setBudgetAllocation] = useState(milestone.budgetAllocation)
  const [paymentTrigger, setPaymentTrigger] = useState<PaymentReleaseMode>(milestone.paymentTrigger)
  const [targetWeek, setTargetWeek] = useState(milestone.targetWeek)

  return (
    <div
      className={cn(
        'rounded-card border p-3 space-y-3 transition-colors',
        isHighlighted ? 'border-brand-primary bg-brand-primary/5' : 'border-border'
      )}
    >
      <p className="text-sm font-body font-medium text-text-heading">
        {milestone.name}
      </p>

      <div>
        <label
          htmlFor={`budget-${milestone.id}`}
          className="block text-xs font-body font-medium text-text-caption mb-1"
        >
          Budget Allocation ($)
        </label>
        <TextInput
          id={`budget-${milestone.id}`}
          type="number"
          value={String(budgetAllocation)}
          onChange={(e) => {
            setBudgetAllocation(Number(e.target.value))
            onDirty()
          }}
        />
      </div>

      <div>
        <label
          htmlFor={`trigger-${milestone.id}`}
          className="block text-xs font-body font-medium text-text-caption mb-1"
        >
          Payment Trigger
        </label>
        <Select
          value={paymentTrigger}
          onValueChange={(value: string) => {
            setPaymentTrigger(value as PaymentReleaseMode)
            onDirty()
          }}
        >
          <SelectTrigger id={`trigger-${milestone.id}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">{PAYMENT_TRIGGER_LABELS['manual']}</SelectItem>
            <SelectItem value="auto-on-approval">{PAYMENT_TRIGGER_LABELS['auto-on-approval']}</SelectItem>
            <SelectItem value="apg-silent">{PAYMENT_TRIGGER_LABELS['apg-silent']}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor={`week-${milestone.id}`}
          className="block text-xs font-body font-medium text-text-caption mb-1"
        >
          Target Week
        </label>
        <TextInput
          id={`week-${milestone.id}`}
          type="number"
          value={String(targetWeek)}
          onChange={(e) => {
            setTargetWeek(Number(e.target.value))
            onDirty()
          }}
        />
      </div>
    </div>
  )
}
