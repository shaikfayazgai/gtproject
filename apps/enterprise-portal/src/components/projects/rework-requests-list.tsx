'use client'
import { useQuery } from '@tanstack/react-query'
import { Badge, Card, CardContent } from '@glimmora/ui'
import type { MockReworkRequest } from '../../lib/msw/factories/evidence'

interface ReworkRequestsListProps {
  projectId: string
}

export function ReworkRequestsList({ projectId }: ReworkRequestsListProps) {
  const { data: requests = [], isLoading } = useQuery<MockReworkRequest[]>({
    queryKey: ['rework', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}/rework`)
      if (!res.ok) throw new Error('Failed to fetch rework requests')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-body text-text-caption">Loading rework requests...</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-body text-text-caption">No rework requests found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Rework Requests</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Evidence packs returned for revision with specific feedback.
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-body font-medium text-text-heading">
                    {req.milestoneName}
                  </p>
                  <p className="text-xs font-body text-text-caption mt-0.5">
                    Pack: {req.packId}
                  </p>
                </div>
                <Badge status={req.status === 'responded' ? 'done' : 'normal'}>
                  {req.status === 'responded' ? 'Responded' : 'Pending'}
                </Badge>
              </div>
              <p className="text-sm font-body text-text-body line-clamp-2 mb-2">
                {req.reason}
              </p>
              <div className="flex items-center justify-between text-xs font-body text-text-caption">
                <span>
                  {req.itemsToAddress.split('\n').length} item(s) to address
                </span>
                <span>
                  Submitted {new Date(req.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
