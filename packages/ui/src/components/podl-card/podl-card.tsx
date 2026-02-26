'use client'
import { Shield, ExternalLink, Download } from 'lucide-react'
import { Tag } from '../tag/tag'
import { cn } from '../../lib/utils'

interface PoDLCardProps {
  title: string
  projectName: string
  completedDate: string
  skills: string[]
  verificationHash: string
  chainVerified: boolean
  onShare?: () => void
  onExport?: () => void
  className?: string
}

export function PoDLCard({
  title,
  projectName,
  completedDate,
  skills,
  verificationHash,
  chainVerified,
  onShare,
  onExport,
  className,
}: PoDLCardProps) {
  return (
    <div
      className={cn(
        'bg-bg-card rounded-card shadow-card border border-border overflow-hidden',
        className
      )}
    >
      {/* Gradient header strip */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-gold h-1" />

      <div className="p-5">
        {/* Title and project */}
        <h3 className="text-lg font-display font-semibold text-text-heading">
          {title}
        </h3>
        <p className="mt-1 text-sm font-body text-text-caption">{projectName}</p>
        <p className="text-sm font-body text-text-caption">
          Completed {completedDate}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <Tag key={skill} variant="skill">
                {skill}
              </Tag>
            ))}
          </div>
        )}

        {/* Verification status */}
        <div className="mt-4 flex items-center gap-2">
          {chainVerified ? (
            <>
              <Shield className="h-4 w-4 text-status-success" />
              <span className="text-sm font-body font-medium text-status-success">
                Chain Verified
              </span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 text-text-caption" />
              <span className="text-sm font-body font-medium text-text-caption">
                Pending Verification
              </span>
            </>
          )}
        </div>

        {/* Verification hash */}
        <p className="mt-1 font-mono text-xs text-text-caption truncate max-w-[200px]">
          {verificationHash}
        </p>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-1.5 rounded-inner px-3 py-1.5 text-xs font-body font-medium text-text-body hover:bg-hover transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Share
            </button>
          )}
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-inner px-3 py-1.5 text-xs font-body font-medium text-text-body hover:bg-hover transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
