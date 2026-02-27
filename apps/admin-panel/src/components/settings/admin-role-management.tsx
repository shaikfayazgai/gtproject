'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DataTable,
  Badge,
  Button,
  TextInput,
  Spinner,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@glimmora/ui'
import { Plus, UserCog } from 'lucide-react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminUser, AdminRole } from '@glimmora/types'

const ROLE_BADGE_MAP: Record<AdminRole, 'done' | 'urgent'> = {
  super_admin: 'urgent',
  standard_admin: 'done',
}

export function AdminRoleManagement() {
  const queryClient = useQueryClient()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminRole>('standard_admin')
  const [roleChange, setRoleChange] = useState<{ admin: AdminUser; newRole: AdminRole } | null>(null)

  const { data: admins, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin-settings-admins'],
    queryFn: async () => {
      const res = await fetch('/api/admin/settings/admins')
      if (!res.ok) throw new Error('Failed to fetch admins')
      return res.json()
    },
  })

  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, adminRole }: { id: string; adminRole: AdminRole }) => {
      const res = await fetch(`/api/admin/settings/admins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminRole }),
      })
      if (!res.ok) throw new Error('Failed to change role')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings-admins'] })
      setRoleChange(null)
    },
  })

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; adminRole: AdminRole }) => {
      const res = await fetch('/api/admin/settings/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to invite admin')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings-admins'] })
      setInviteOpen(false)
      setInviteEmail('')
      setInviteRole('standard_admin')
    },
  })

  const columns: ColumnDef<AdminUser, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'displayName',
        header: 'Name',
        cell: ({ getValue }) => (
          <span className="font-medium text-text-heading">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'adminRole',
        header: 'Role',
        cell: ({ getValue }) => {
          const role = getValue() as AdminRole
          return (
            <Badge status={ROLE_BADGE_MAP[role]}>
              {role === 'super_admin' ? 'Super Admin' : 'Standard Admin'}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Login',
        cell: ({ getValue }) =>
          format(new Date(getValue() as string), 'MMM d, yyyy HH:mm'),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge status={getValue() ? 'done' : 'atrisk'}>
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => setRoleChange({
              admin: row.original,
              newRole: row.original.adminRole === 'super_admin' ? 'standard_admin' : 'super_admin',
            })}
            className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
            aria-label="Change role"
          >
            <UserCog className="h-4 w-4" />
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading admin list..." />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-semibold text-text-heading">
          Admin Users
        </h3>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Invite Admin
        </Button>
      </div>

      <DataTable<AdminUser>
        columns={columns}
        data={admins ?? []}
        pageSize={10}
      />

      {/* Change Role Dialog */}
      <Dialog
        open={!!roleChange}
        onOpenChange={(open) => { if (!open) setRoleChange(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Admin Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm font-body text-text-body">
              Change <strong>{roleChange?.admin.displayName}</strong> from{' '}
              <Badge status={ROLE_BADGE_MAP[roleChange?.admin.adminRole ?? 'standard_admin']}>
                {roleChange?.admin.adminRole === 'super_admin' ? 'Super Admin' : 'Standard Admin'}
              </Badge>{' '}
              to{' '}
              <Badge status={ROLE_BADGE_MAP[roleChange?.newRole ?? 'standard_admin']}>
                {roleChange?.newRole === 'super_admin' ? 'Super Admin' : 'Standard Admin'}
              </Badge>
            </p>
            <div>
              <label className="block text-sm font-medium text-text-heading font-body mb-1.5">
                New Role
              </label>
              <Select
                value={roleChange?.newRole ?? 'standard_admin'}
                onValueChange={(v) =>
                  roleChange && setRoleChange({ ...roleChange, newRole: v as AdminRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard_admin">Standard Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() =>
                roleChange &&
                changeRoleMutation.mutate({ id: roleChange.admin.id, adminRole: roleChange.newRole })
              }
              disabled={changeRoleMutation.isPending}
            >
              {changeRoleMutation.isPending ? 'Saving...' : 'Change Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Admin Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextInput
              label="Email"
              type="email"
              placeholder="admin@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-text-heading font-body mb-1.5">
                Role
              </label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AdminRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard_admin">Standard Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => inviteMutation.mutate({ email: inviteEmail, adminRole: inviteRole })}
              disabled={!inviteEmail.trim() || inviteMutation.isPending}
            >
              {inviteMutation.isPending ? 'Inviting...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
