'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@glimmora/ui'
import type { TaskCategory } from '@glimmora/types'

export function TaskCategoryManager() {
  const queryClient = useQueryClient()
  const { data } = useQuery<{ data: TaskCategory[] }>({
    queryKey: ['governor-categories'],
    queryFn: () => fetch('/api/governor/categories').then(r => r.json()),
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const res = await fetch(`/api/governor/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled }),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governor-categories'] })
    },
  })

  const categories = data?.data || []

  return (
    <div className="space-y-4">
      <p className="text-xs font-body text-text-caption">
        Toggle which task categories your institution participates in.
        Active categories will be available for students to discover and accept tasks.
      </p>

      <div className="bg-bg-card rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-bg-dashboard">
              <th className="text-start px-4 py-3 text-xs font-medium text-text-caption uppercase tracking-wider">Category</th>
              <th className="text-start px-4 py-3 text-xs font-medium text-text-caption uppercase tracking-wider">Description</th>
              <th className="text-start px-4 py-3 text-xs font-medium text-text-caption uppercase tracking-wider">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text-heading">{cat.name}</td>
                <td className="px-4 py-3 text-text-caption">{cat.description}</td>
                <td className="px-4 py-3">
                  <Switch
                    checked={cat.isEnabled}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: cat.id, isEnabled: checked === true })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
