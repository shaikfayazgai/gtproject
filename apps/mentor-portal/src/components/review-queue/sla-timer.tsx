'use client'
import { useState, useEffect } from 'react'
import { cn } from '@glimmora/ui'

type SLAStatus = 'normal' | 'warning' | 'urgent' | 'overdue'

function formatTimeLeft(deadline: string): { text: string; status: SLAStatus } {
  const now = Date.now()
  const end = new Date(deadline).getTime()
  const hoursLeft = (end - now) / (1000 * 60 * 60)

  if (hoursLeft < 0) return { text: 'Overdue', status: 'overdue' }
  if (hoursLeft < 4) {
    const h = Math.floor(hoursLeft)
    const m = Math.floor((hoursLeft % 1) * 60)
    return { text: `${h}h ${m}m left`, status: 'urgent' }
  }
  if (hoursLeft < 12) return { text: `${Math.floor(hoursLeft)}h left`, status: 'warning' }
  return { text: `${Math.floor(hoursLeft)}h left`, status: 'normal' }
}

export function SLATimer({ deadline }: { deadline: string }) {
  const [mounted, setMounted] = useState(false)
  const [timeInfo, setTimeInfo] = useState<{ text: string; status: SLAStatus }>({
    text: '--',
    status: 'normal',
  })

  useEffect(() => {
    setMounted(true)
    setTimeInfo(formatTimeLeft(deadline))
    const interval = setInterval(() => setTimeInfo(formatTimeLeft(deadline)), 60_000)
    return () => clearInterval(interval)
  }, [deadline])

  const colorMap: Record<SLAStatus, string> = {
    normal: 'text-text-caption',
    warning: 'text-amber-600',
    urgent: 'text-brand-primary font-medium',
    overdue: 'text-red-600 font-medium',
  }

  if (!mounted) return <span className="text-xs text-text-caption">--</span>
  return <span className={cn('text-xs', colorMap[timeInfo.status])}>{timeInfo.text}</span>
}
