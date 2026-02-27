'use client'

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@glimmora/ui'
import { CaseContextPanel } from './case-context-panel'
import { EvidenceMessagesPanel } from './evidence-messages-panel'
import { DecisionFormPanel } from './decision-form-panel'
import type { Dispute } from '@glimmora/types'

interface DisputeDetailLayoutProps {
  dispute: Dispute & {
    assignedAdminName?: string
    slaDeadline?: string
    relatedEvidencePackId?: string
    relatedPaymentId?: string
  }
}

export function DisputeDetailLayout({ dispute }: DisputeDetailLayoutProps) {
  return (
    <>
      {/* Desktop: 3-panel resizable */}
      <div className="hidden lg:flex h-[calc(100vh-12rem)]">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <CaseContextPanel dispute={dispute} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={45} minSize={30}>
            <EvidenceMessagesPanel disputeId={dispute.id} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <DecisionFormPanel disputeId={dispute.id} disputeType={dispute.type} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile/Tablet: stacked panels */}
      <div className="lg:hidden flex flex-col gap-4 p-4">
        <CaseContextPanel dispute={dispute} />
        <EvidenceMessagesPanel disputeId={dispute.id} />
        <DecisionFormPanel disputeId={dispute.id} disputeType={dispute.type} />
      </div>
    </>
  )
}
