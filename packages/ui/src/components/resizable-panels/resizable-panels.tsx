'use client'
import * as React from 'react'
import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels'
import { cn } from '../../lib/utils'

type GroupProps = React.ComponentPropsWithoutRef<typeof Group>
type SeparatorProps = React.ComponentPropsWithoutRef<typeof Separator>

type ResizablePanelGroupProps = Omit<GroupProps, 'id'> & {
  /**
   * When provided, panel sizes are persisted to localStorage using this key.
   * Maps to react-resizable-panels v4 useDefaultLayout({ id, storage: localStorage }).
   */
  autoSaveId?: string
  id?: string
}

export function ResizablePanelGroup({
  className,
  autoSaveId,
  id,
  ...props
}: ResizablePanelGroupProps) {
  const persistId = autoSaveId ?? id

  // Use layout persistence only in browser (localStorage unavailable on server)
  const isBrowser = typeof window !== 'undefined'

  const { defaultLayout, onLayoutChanged } = useDefaultLayout(
    isBrowser && persistId
      ? {
          id: persistId,
          storage: localStorage,
        }
      : { id: persistId ?? 'panel-group' }
  )

  return (
    <Group
      id={persistId}
      className={cn('flex h-full w-full', className)}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      {...props}
    />
  )
}
ResizablePanelGroup.displayName = 'ResizablePanelGroup'

export const ResizablePanel = Panel

export function ResizableHandle({ className, ...props }: SeparatorProps) {
  return (
    <Separator
      className={cn(
        'relative flex w-px items-center justify-center bg-border-default',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        'hover:bg-brand-primary/30 cursor-col-resize transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary',
        className
      )}
      {...props}
    />
  )
}
ResizableHandle.displayName = 'ResizableHandle'
