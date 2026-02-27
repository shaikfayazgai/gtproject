'use client'

import { useState } from 'react'
import { Card, CardContent, Button, TextInput, Switch, Caption } from '@glimmora/ui'
import { Pencil } from 'lucide-react'
import { format } from 'date-fns'
import type { APGConfigEntry } from '@glimmora/types'

interface ConfigCardProps {
  entry: APGConfigEntry
  onSave: (id: string, value: string | number | boolean) => Promise<void>
}

export function ConfigCard({ entry, onSave }: ConfigCardProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState<string | number | boolean>(entry.value)
  const [saving, setSaving] = useState(false)

  const isBoolean = typeof entry.value === 'boolean'
  const isNumber = typeof entry.value === 'number'

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(entry.id, value)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setValue(entry.value)
    setEditing(false)
  }

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-display font-semibold text-text-heading">
              {entry.label}
            </h4>
            <p className="mt-0.5 text-xs font-body text-text-caption">
              {entry.description}
            </p>

            {editing ? (
              <div className="mt-3 space-y-3">
                {isBoolean ? (
                  <Switch
                    id={`config-${entry.id}`}
                    checked={value as boolean}
                    onCheckedChange={(checked) => setValue(!!checked)}
                    label={value ? 'Enabled' : 'Disabled'}
                  />
                ) : (
                  <TextInput
                    type={isNumber ? 'number' : 'text'}
                    value={String(value)}
                    onChange={(e) =>
                      setValue(isNumber ? Number(e.target.value) : e.target.value)
                    }
                  />
                )}
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-base font-display font-medium text-text-heading">
                  {isBoolean ? (entry.value ? 'Enabled' : 'Disabled') : String(entry.value)}
                </p>
              </div>
            )}

            <Caption className="mt-2">
              Last updated by {entry.updatedBy} on{' '}
              {format(new Date(entry.updatedAt), 'MMM d, yyyy')}
            </Caption>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors shrink-0"
              aria-label={`Edit ${entry.label}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
