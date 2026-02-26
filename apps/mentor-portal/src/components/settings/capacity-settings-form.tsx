'use client'
import { useState, useEffect } from 'react'
import { Slider, Switch, Button, PageHeader, Skeleton } from '@glimmora/ui'
import { useQuery, useMutation } from '@tanstack/react-query'

interface CapacityData {
  hoursPerWeek: number
  isPaused: boolean
}

export function CapacitySettingsForm() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [isPaused, setIsPaused] = useState(false)

  const { data, isLoading } = useQuery<CapacityData>({
    queryKey: ['mentor', 'capacity'],
    queryFn: () => fetch('/api/mentor/profile').then(r => r.json()).then(d => ({
      hoursPerWeek: d.capacityHoursPerWeek ?? 10,
      isPaused: d.isPaused ?? false,
    })),
  })

  useEffect(() => {
    if (data) {
      setHoursPerWeek(data.hoursPerWeek)
      setIsPaused(data.isPaused)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (payload: CapacityData) => {
      const res = await fetch('/api/mentor/capacity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return res.json()
    },
  })

  const handleSave = () => mutation.mutate({ hoursPerWeek, isPaused })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48 rounded-inner" />
        <Skeleton className="h-32 rounded-card" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Capacity Settings" />

      <div className="max-w-lg space-y-6">
        <div className="bg-bg-card rounded-card shadow-card p-5 space-y-6">
          {/* Weekly Review Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="hours-slider" className="text-sm font-body font-medium text-text-body">
                Weekly Review Hours
              </label>
              <span className="text-sm font-display font-semibold text-brand-primary">
                {hoursPerWeek}h / week
              </span>
            </div>
            <Slider
              id="hours-slider"
              min={5}
              max={40}
              step={5}
              value={[hoursPerWeek]}
              onValueChange={(vals) => setHoursPerWeek(vals[0])}
            />
            <div className="flex justify-between text-xs font-body text-text-disabled">
              <span>5h</span>
              <span>40h</span>
            </div>
          </div>

          {/* Temporary Pause */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
            <div>
              <label htmlFor="pause-switch" className="text-sm font-body font-medium text-text-body cursor-pointer">
                Pause review queue
              </label>
              <p className="text-xs font-body text-text-caption mt-0.5">
                Temporarily pause new reviews from being assigned to your queue
              </p>
            </div>
            <Switch
              id="pause-switch"
              checked={isPaused}
              onCheckedChange={setIsPaused}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          loading={mutation.isPending}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
