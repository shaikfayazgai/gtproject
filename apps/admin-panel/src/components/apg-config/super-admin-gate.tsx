'use client'

import { Shield } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { Heading, Body } from '@glimmora/ui'

export function SuperAdminGate({ children }: { children: React.ReactNode }) {
  const adminRole = useAuthStore((s) => s.adminRole)

  if (adminRole !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Shield className="h-12 w-12 text-text-caption" />
        <Heading level="h3">Super Admin Access Required</Heading>
        <Body className="text-text-caption text-center max-w-md">
          This section is restricted to Super Admin users. Contact your platform
          administrator if you need access.
        </Body>
      </div>
    )
  }

  return <>{children}</>
}
