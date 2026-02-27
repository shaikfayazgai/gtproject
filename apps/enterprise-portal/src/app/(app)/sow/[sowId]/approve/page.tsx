'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Spinner } from '@glimmora/ui'
import type { Blueprint, SOWIntelligence } from '@glimmora/types'
import { BlueprintApproval } from '@/components/sow/blueprint-approval'

interface BlueprintResponse {
  blueprint: Blueprint
  intelligence: SOWIntelligence
}

export default function BlueprintApprovePage() {
  const params = useParams<{ sowId: string }>()

  const { data, isLoading, error } = useQuery<BlueprintResponse>({
    queryKey: ['blueprint', params.sowId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/blueprint/${params.sowId}`)
      if (!res.ok) throw new Error('Failed to fetch blueprint')
      return res.json()
    },
  })

  return (
    <div className="p-6">
      <PageHeader
        title="Blueprint Approval"
        subtitle="Review and approve the project blueprint before team formation begins"
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="p-4 text-status-urgent text-sm">
          Failed to load blueprint. Please try again.
        </div>
      )}

      {data && (
        <BlueprintApproval
          blueprint={data.blueprint}
          sowId={params.sowId}
        />
      )}
    </div>
  )
}
