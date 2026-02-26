import { http, HttpResponse } from 'msw'
import type { MentorConversation } from '@glimmora/types'
import { isoPast } from '../factories/common'

type MentorSenderRole = 'mentor' | 'platform'

interface ConversationMessage {
  id: string
  senderRole: MentorSenderRole
  content: string
  sentAt: string
}

const mockConversations: MentorConversation[] = [
  {
    id: 'conv-001',
    subject: 'Reminder: SLA compliance guidelines update',
    lastMessage: 'Please review the updated SLA compliance guidelines attached to this message.',
    lastMessageAt: isoPast(2),
    unread: true,
  },
  {
    id: 'conv-002',
    subject: 'New mentor onboarding resources available',
    lastMessage: 'We have added new resources to help you with your mentoring journey.',
    lastMessageAt: isoPast(24),
    unread: false,
  },
  {
    id: 'conv-003',
    subject: 'Your tier upgrade review is complete',
    lastMessage: 'Congratulations! Your Silver tier upgrade has been confirmed.',
    lastMessageAt: isoPast(72),
    unread: false,
  },
]

const mockMessages: Record<string, ConversationMessage[]> = {
  'conv-001': [
    {
      id: 'msg-001-1',
      senderRole: 'platform',
      content: 'Hello, this is a reminder about the updated SLA compliance guidelines. Please ensure you are following the new 24-hour review standard.',
      sentAt: isoPast(4),
    },
    {
      id: 'msg-001-2',
      senderRole: 'platform',
      content: 'Please review the updated SLA compliance guidelines attached to this message.',
      sentAt: isoPast(2),
    },
  ],
  'conv-002': [
    {
      id: 'msg-002-1',
      senderRole: 'platform',
      content: 'We have added new resources to help you with your mentoring journey. These include updated review rubrics and evidence evaluation guides.',
      sentAt: isoPast(30),
    },
    {
      id: 'msg-002-2',
      senderRole: 'mentor',
      content: 'Thank you, I will review the new resources.',
      sentAt: isoPast(24),
    },
    {
      id: 'msg-002-3',
      senderRole: 'platform',
      content: 'Great! Let us know if you have any questions.',
      sentAt: isoPast(20),
    },
  ],
  'conv-003': [
    {
      id: 'msg-003-1',
      senderRole: 'platform',
      content: 'We are pleased to inform you that your Silver tier upgrade request has been reviewed.',
      sentAt: isoPast(80),
    },
    {
      id: 'msg-003-2',
      senderRole: 'platform',
      content: 'Congratulations! Your Silver tier upgrade has been confirmed. You now have access to higher-value review tasks.',
      sentAt: isoPast(72),
    },
  ],
}

export const conversationHandlers = [
  http.get('/api/mentor/conversations', () => {
    return HttpResponse.json({ data: mockConversations })
  }),

  http.get('/api/mentor/conversations/:id/messages', ({ params }) => {
    const messages = mockMessages[params.id as string] ?? []
    return HttpResponse.json({ data: messages })
  }),

  http.post('/api/mentor/conversations/:id/messages', async ({ params, request }) => {
    const body = await request.json() as { content: string }
    const newMessage: ConversationMessage = {
      id: `msg-${params.id}-${Date.now()}`,
      senderRole: 'mentor',
      content: body.content,
      sentAt: new Date().toISOString(),
    }
    const existing = mockMessages[params.id as string]
    if (existing) {
      existing.push(newMessage)
    } else {
      mockMessages[params.id as string] = [newMessage]
    }
    return HttpResponse.json(newMessage, { status: 201 })
  }),
]
