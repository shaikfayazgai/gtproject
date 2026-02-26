'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs/tabs'
import { Highlight, themes } from 'prism-react-renderer'
import {
  Code,
  FileText,
  Link as LinkIcon,
  Video,
  Type,
  Download,
  ExternalLink,
} from 'lucide-react'
import { cn } from '../../lib/utils'

// --- Evidence types (NO contributor identity by design -- blind review) ---

export interface CodeEvidence {
  type: 'code'
  language: string
  code: string
  filename?: string
}

export interface DocumentEvidence {
  type: 'document'
  filename: string
  fileSize: string
  fileType: string
  downloadUrl: string
}

export interface LinkEvidence {
  type: 'link'
  url: string
  title?: string
  description?: string
}

export interface VideoEvidence {
  type: 'video'
  url: string
  title?: string
}

export interface TextEvidence {
  type: 'text'
  content: string
}

export type Evidence =
  | CodeEvidence
  | DocumentEvidence
  | LinkEvidence
  | VideoEvidence
  | TextEvidence

type EvidenceType = Evidence['type']

interface EvidenceViewerProps {
  evidence: Evidence[]
  className?: string
}

const tabConfig: Record<EvidenceType, { icon: React.ElementType; label: string }> = {
  code: { icon: Code, label: 'Code' },
  document: { icon: FileText, label: 'Document' },
  link: { icon: LinkIcon, label: 'Link' },
  video: { icon: Video, label: 'Video' },
  text: { icon: Type, label: 'Text' },
}

function CodePanel({ items }: { items: CodeEvidence[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="bg-bg-dashboard rounded-inner overflow-hidden">
          {item.filename && (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-hover">
              <Code className="h-3.5 w-3.5 text-text-caption" />
              <span className="text-xs font-mono text-text-caption">
                {item.filename}
              </span>
            </div>
          )}
          <div className="overflow-x-auto">
            <Highlight theme={themes.github} code={item.code} language={item.language}>
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className="p-4 text-sm font-mono leading-relaxed"
                  style={{ ...style, background: 'transparent' }}
                >
                  {tokens.map((line, lineIdx) => (
                    <div key={lineIdx} {...getLineProps({ line })} className="table-row">
                      <span className="table-cell pr-4 text-right text-text-disabled select-none w-8">
                        {lineIdx + 1}
                      </span>
                      <span className="table-cell">
                        {line.map((token, tokenIdx) => (
                          <span key={tokenIdx} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      ))}
    </div>
  )
}

function DocumentPanel({ items }: { items: DocumentEvidence[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-inner border border-border bg-bg-card p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-inner bg-brand-primary/10">
            <FileText className="h-5 w-5 text-brand-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-body font-medium text-text-heading truncate">
              {item.filename}
            </p>
            <p className="text-xs font-body text-text-caption">
              {item.fileType} &middot; {item.fileSize}
            </p>
          </div>
          <a
            href={item.downloadUrl}
            download
            className="flex items-center gap-1.5 rounded-inner px-3 py-1.5 text-xs font-body font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      ))}
    </div>
  )
}

function LinkPanel({ items }: { items: LinkEvidence[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-inner border border-border bg-bg-card p-4 hover:border-brand-primary/30 transition-colors group"
        >
          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-text-caption group-hover:text-brand-primary transition-colors" />
          <div className="min-w-0">
            {item.title && (
              <p className="text-sm font-body font-medium text-text-heading">
                {item.title}
              </p>
            )}
            <p className="text-xs font-mono text-brand-primary truncate">{item.url}</p>
            {item.description && (
              <p className="mt-1 text-xs font-body text-text-caption">
                {item.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}

function VideoPanel({ items }: { items: VideoEvidence[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i}>
          {item.title && (
            <p className="mb-2 text-sm font-body font-medium text-text-heading">
              {item.title}
            </p>
          )}
          <iframe
            src={item.url}
            title={item.title ?? `Video ${i + 1}`}
            className="w-full aspect-video rounded-inner"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  )
}

function TextPanel({ items }: { items: TextEvidence[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-inner border border-border bg-bg-card p-4"
        >
          <div className="prose prose-sm max-w-none text-sm font-body text-text-body whitespace-pre-wrap">
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}

export function EvidenceViewer({ evidence, className }: EvidenceViewerProps) {
  const byType = evidence.reduce<Record<EvidenceType, Evidence[]>>(
    (acc, e) => {
      acc[e.type].push(e)
      return acc
    },
    { code: [], document: [], link: [], video: [], text: [] }
  )

  const activeTabs = (Object.keys(byType) as EvidenceType[]).filter(
    (t) => byType[t].length > 0
  )

  if (activeTabs.length === 0) return null

  return (
    <div className={cn('w-full', className)}>
      <Tabs defaultValue={activeTabs[0]}>
        <TabsList>
          {activeTabs.map((type) => {
            const { icon: Icon, label } = tabConfig[type]
            return (
              <TabsTrigger key={type} value={type}>
                <Icon className="mr-1.5 h-4 w-4" />
                {label}
                <span className="ml-1.5 text-xs text-text-disabled">
                  ({byType[type].length})
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {activeTabs.includes('code') && (
          <TabsContent value="code">
            <CodePanel items={byType.code as CodeEvidence[]} />
          </TabsContent>
        )}
        {activeTabs.includes('document') && (
          <TabsContent value="document">
            <DocumentPanel items={byType.document as DocumentEvidence[]} />
          </TabsContent>
        )}
        {activeTabs.includes('link') && (
          <TabsContent value="link">
            <LinkPanel items={byType.link as LinkEvidence[]} />
          </TabsContent>
        )}
        {activeTabs.includes('video') && (
          <TabsContent value="video">
            <VideoPanel items={byType.video as VideoEvidence[]} />
          </TabsContent>
        )}
        {activeTabs.includes('text') && (
          <TabsContent value="text">
            <TextPanel items={byType.text as TextEvidence[]} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
