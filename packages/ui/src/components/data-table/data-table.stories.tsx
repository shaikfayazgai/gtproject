import type { Meta, StoryObj } from '@storybook/nextjs'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'

const meta: Meta<typeof DataTable> = {
  title: 'Design System/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof DataTable>

interface Task {
  name: string
  status: string
  priority: string
  created: string
  actions: string
}

const columns: ColumnDef<Task, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'priority', header: 'Priority' },
  { accessorKey: 'created', header: 'Created' },
  { accessorKey: 'actions', header: 'Actions', enableSorting: false },
]

const statuses = ['In Progress', 'Completed', 'Pending', 'Under Review', 'Blocked']
const priorities = ['High', 'Medium', 'Low', 'Urgent', 'Normal']
const taskNames = [
  'API Integration Module',
  'Database Schema Design',
  'User Auth Flow',
  'Dashboard Layout',
  'Evidence Upload',
  'Skill Tagging Engine',
  'SOW Parser Service',
  'Payment Gateway',
  'Notification System',
  'Report Generator',
  'Deployment Pipeline',
  'Access Control Module',
  'Data Migration Script',
  'Test Suite Expansion',
  'Performance Audit',
  'Mobile Responsive Fix',
  'Error Boundary Setup',
  'Logging Infrastructure',
  'Cache Layer Config',
  'Webhook Integration',
]

const data: Task[] = taskNames.map((name, i) => ({
  name,
  status: statuses[i % statuses.length],
  priority: priorities[i % priorities.length],
  created: `2026-02-${String(i + 1).padStart(2, '0')}`,
  actions: 'View',
}))

export const Default: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <DataTable columns={columns} data={data} />
    </div>
  ),
}

export const WithSelection: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <DataTable columns={columns} data={data} enableSelection />
    </div>
  ),
}

export const SmallPageSize: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <DataTable columns={columns} data={data} pageSize={5} />
    </div>
  ),
}
