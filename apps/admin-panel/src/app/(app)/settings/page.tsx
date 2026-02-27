'use client'

import { PageHeader } from '@glimmora/ui'
import { SuperAdminGate } from '@/components/apg-config/super-admin-gate'
import { AdminRoleManagement } from '@/components/settings'

export default function SettingsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Admin Settings"
        subtitle="Manage administrator accounts and platform settings"
      />

      <SuperAdminGate>
        <AdminRoleManagement />
      </SuperAdminGate>
    </div>
  )
}
