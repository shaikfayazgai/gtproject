'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Button,
  Textarea,
  EvidenceViewer,
  Spinner,
} from '@glimmora/ui'
import type { Evidence } from '@glimmora/ui'
import { formatDistanceToNow } from 'date-fns'
import { Send, FileText, Image, Terminal, MessageSquare } from 'lucide-react'
import type { DisputeEvidence, DisputeMessage } from '@glimmora/types'

const submitterStatusMap: Record<string, 'normal' | 'inprogress' | 'atrisk' | 'urgent'> = {
  requester: 'normal',
  contributor: 'inprogress',
  admin: 'atrisk',
  system: 'done' as 'normal',
}

const evidenceTypeIcon: Record<string, React.ElementType> = {
  text: MessageSquare,
  file: FileText,
  screenshot: Image,
  log: Terminal,
}

function mapToViewerEvidence(items: DisputeEvidence[]): Evidence[] {
  return items
    .filter((item) => item.type === 'text' || item.type === 'log')
    .map((item) => ({
      type: 'text' as const,
      content: item.content,
    }))
}

interface EvidenceMessagesPanelProps {
  disputeId: string
}

export function EvidenceMessagesPanel({ disputeId }: EvidenceMessagesPanelProps) {
  const queryClient = useQueryClient()
  const [messageContent, setMessageContent] = useState('')

  // Fetch evidence
  const { data: evidence, isLoading: evidenceLoading } = useQuery<DisputeEvidence[]>({
    queryKey: ['dispute-evidence', disputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/evidence`)
      if (!res.ok) throw new Error('Failed to fetch evidence')
      return res.json()
    },
  })

  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery<DisputeMessage[]>({
    queryKey: ['dispute-messages', disputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/messages`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      return res.json()
    },
  })

  // Send message
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error('Failed to send message')
      return res.json()
    },
    onSuccess: () => {
      setMessageContent('')
      queryClient.invalidateQueries({ queryKey: ['dispute-messages', disputeId] })
    },
  })

  function handleSendMessage() {
    if (!messageContent.trim()) return
    sendMessage.mutate(messageContent.trim())
  }

  return (
    <div className="h-full overflow-y-auto bg-bg-dashboard">
      <Tabs defaultValue="evidence">
        <div className="sticky top-0 z-10 bg-bg-dashboard border-b border-border px-4 pt-4">
          <TabsList>
            <TabsTrigger value="evidence">
              <FileText className="mr-1.5 h-4 w-4" />
              Evidence
              {evidence && (
                <span className="ml-1.5 text-xs text-text-disabled">({evidence.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="mr-1.5 h-4 w-4" />
              Messages
              {messages && (
                <span className="ml-1.5 text-xs text-text-disabled">({messages.length})</span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="evidence" className="p-4">
          {evidenceLoading ? (
            <div className="flex justify-center py-8">
              <Spinner label="Loading evidence..." />
            </div>
          ) : evidence && evidence.length > 0 ? (
            <div className="space-y-4">
              {/* Individual evidence items with metadata */}
              {evidence.map((item) => {
                const Icon = evidenceTypeIcon[item.type] || FileText
                return (
                  <div
                    key={item.id}
                    className="rounded-inner border border-border bg-bg-card p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge status={submitterStatusMap[item.submittedBy] || 'normal'}>
                        {item.submittedBy}
                      </Badge>
                      <Badge status="normal">
                        <Icon className="h-3 w-3 mr-1" />
                        {item.type}
                      </Badge>
                      <span className="text-xs font-body text-text-caption ml-auto">
                        {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm font-body text-text-body whitespace-pre-wrap">
                      {item.content}
                    </p>
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-body text-brand-primary hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View attachment
                      </a>
                    )}
                  </div>
                )
              })}

              {/* EvidenceViewer for text/log evidence */}
              {mapToViewerEvidence(evidence).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
                    Evidence Viewer
                  </p>
                  <EvidenceViewer evidence={mapToViewerEvidence(evidence)} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm font-body text-text-caption text-center py-8">
              No evidence submitted yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="messages" className="flex flex-col">
          <div className="flex-1 p-4 space-y-3">
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <Spinner label="Loading messages..." />
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-inner p-3 space-y-1 ${
                    msg.senderRole === 'admin'
                      ? 'bg-brand-primary/5 border border-brand-primary/20 ml-8'
                      : 'bg-bg-card border border-border mr-8'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      status={
                        msg.senderRole === 'admin'
                          ? 'atrisk'
                          : msg.senderRole === 'requester'
                            ? 'normal'
                            : 'inprogress'
                      }
                    >
                      {msg.senderRole}
                    </Badge>
                    <span className="text-xs font-body text-text-caption">
                      {formatDistanceToNow(new Date(msg.sentAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm font-body text-text-body">{msg.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm font-body text-text-caption text-center py-8">
                No messages yet.
              </p>
            )}
          </div>

          {/* Message input */}
          <div className="sticky bottom-0 bg-bg-dashboard border-t border-border p-4">
            <div className="flex gap-2">
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message as admin..."
                className="flex-1 min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || sendMessage.isPending}
                className="self-end"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {sendMessage.isError && (
              <p className="mt-1 text-xs font-body text-status-urgent">
                Failed to send message. Please try again.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
