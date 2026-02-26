'use client'
import { EvidenceViewer } from '@glimmora/ui'
import type { Evidence as ViewerEvidence } from '@glimmora/ui'
import type { ReviewEvidence } from '@glimmora/types'

// This mapping IS the blind-review privacy boundary.
// ReviewEvidence structurally contains no contributor identity.
function toViewerEvidence(e: ReviewEvidence): ViewerEvidence {
  switch (e.type) {
    case 'code':
      return {
        type: 'code',
        language: e.language || 'typescript',
        code: e.content,
        filename: e.filename,
      }
    case 'document':
      return {
        type: 'document',
        filename: e.filename || 'file',
        fileSize: e.fileSize || 'Unknown',
        fileType: e.fileType || 'application/octet-stream',
        downloadUrl: e.downloadUrl || '#',
      }
    case 'link':
      return {
        type: 'link',
        url: e.url || e.content,
        title: e.title,
        description: e.description,
      }
    case 'video':
      return {
        type: 'video',
        url: e.url || e.content,
        title: e.title,
      }
    case 'text':
      return {
        type: 'text',
        content: e.content,
      }
  }
}

interface EvidenceCenterPanelProps {
  evidences: ReviewEvidence[]
}

export function EvidenceCenterPanel({ evidences }: EvidenceCenterPanelProps) {
  const viewerEvidence = evidences.map(toViewerEvidence)

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-3">
        <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide">
          Evidence
          <span className="ml-1.5 text-text-disabled">({evidences.length})</span>
        </p>
      </div>
      <EvidenceViewer evidence={viewerEvidence} />
    </div>
  )
}
