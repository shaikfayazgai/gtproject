'use client'
import { useState } from 'react'
import { Badge, Button, PageHeader, Skeleton } from '@glimmora/ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { cn } from '@glimmora/ui'
import type { MentorConversation } from '@glimmora/types'

type MentorSenderRole = 'mentor' | 'platform'

interface ConversationMessage {
  id: string
  senderRole: MentorSenderRole
  content: string
  sentAt: string
}

export function MentorMessagesPage() {
  const queryClient = useQueryClient()
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const { data: convsData, isLoading: convsLoading } = useQuery<{ data: MentorConversation[] }>({
    queryKey: ['conversations'],
    queryFn: () => fetch('/api/mentor/conversations').then(r => r.json()),
  })

  const conversations = convsData?.data ?? []
  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0] || null

  const { data: messagesData, isLoading: messagesLoading } = useQuery<{ data: ConversationMessage[] }>({
    queryKey: ['conversations', selectedConv?.id, 'messages'],
    queryFn: () => fetch(`/api/mentor/conversations/${selectedConv?.id}/messages`).then(r => r.json()),
    enabled: !!selectedConv?.id,
  })

  const messages = messagesData?.data ?? []

  const sendMutation = useMutation({
    mutationFn: async ({ convId, content }: { convId: string; content: string }) => {
      const res = await fetch(`/api/mentor/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', selectedConv?.id, 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setReplyText('')
    },
  })

  const handleSend = () => {
    if (!replyText.trim() || !selectedConv) return
    sendMutation.mutate({ convId: selectedConv.id, content: replyText.trim() })
  }

  return (
    <div className="flex flex-col h-full p-6">
      <PageHeader title="Messages" />
      <p className="text-sm font-body text-text-caption mt-1 mb-6">
        Async conversations with platform. You can reply to incoming messages.
      </p>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Conversation list */}
        <div className="lg:w-80 shrink-0 bg-bg-card rounded-card shadow-card overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-display font-semibold text-text-heading">Conversations</h2>
          </div>

          {convsLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-inner" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm font-body text-text-caption text-center py-8">No conversations yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    'w-full text-start p-3 hover:bg-hover transition-colors',
                    selectedConv?.id === conv.id && 'bg-hover'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-body font-medium text-text-heading truncate">{conv.subject}</p>
                    {conv.unread && (
                      <Badge status="inprogress">New</Badge>
                    )}
                  </div>
                  <p className="text-xs font-body text-text-caption mt-1 truncate">{conv.lastMessage}</p>
                  <p className="text-[10px] font-body text-text-disabled mt-1">
                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message view */}
        <div className="flex-1 bg-bg-card rounded-card shadow-card flex flex-col min-h-0">
          {selectedConv ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-border shrink-0">
                <h3 className="font-display text-base font-semibold text-text-heading">{selectedConv.subject}</h3>
                <p className="text-xs font-body text-text-caption mt-0.5">
                  Async conversation with Platform — reply only
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messagesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-inner" />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-sm font-body text-text-caption text-center py-8">No messages in this conversation.</p>
                ) : (
                  messages.map((msg) => {
                    const isMentor = msg.senderRole === 'mentor'
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex', isMentor ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] px-4 py-2.5',
                            isMentor
                              ? 'bg-brand-primary/10 rounded-card rounded-br-none'
                              : 'bg-bg-dashboard border border-border rounded-card rounded-bl-none'
                          )}
                        >
                          <p className="text-[10px] font-body font-medium text-text-caption mb-1">
                            {isMentor ? 'You' : 'Platform'}
                          </p>
                          <p className="text-sm font-body text-text-body">{msg.content}</p>
                          <p className="text-[10px] font-body text-text-disabled mt-1">
                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your reply..."
                    className="flex-1 border border-border bg-bg-card text-text-body rounded-inner px-3 py-2 text-sm font-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!replyText.trim() || sendMutation.isPending}
                    size="md"
                    icon={<Send className="h-4 w-4" />}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm font-body text-text-caption">Select a conversation to view messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
