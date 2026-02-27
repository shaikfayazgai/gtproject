'use client'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, GradientCard, Spinner, APGFeed, Card, CardHeader, CardTitle, CardContent } from '@glimmora/ui'
import {
  ActiveProjectsWidget,
  PendingActionsWidget,
  BudgetWidget,
  HealthMetricsWidget,
} from '@/components/dashboard'

interface DashboardProject {
  id: string
  name: string
  status: string
  health: 'on-track' | 'at-risk' | 'delayed' | 'critical'
  completionPercentage: number
  totalTasks: number
  completedTasks: number
}

interface PendingAction {
  id: string
  label: string
  href: string
  type: 'evidence' | 'payment' | 'blueprint'
}

interface APGAction {
  id: string
  type: 'task_assigned' | 'review_requested' | 'milestone_completed' | 'risk_detected' | 'team_formed' | 'payment_triggered'
  title: string
  description: string
  timestamp: string
  detail?: string
}

interface DashboardData {
  tasksCompletePercentage: number
  activeProjectCount: number
  evidencePacksPending: number
  paymentsReleased: number
  paymentsTotal: number
  currency: string
  timelineHealth: string
  milestonesThisWeek: number
  activeProjects: DashboardProject[]
  recentActivity: APGAction[]
  pendingActions: PendingAction[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['enterprise-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/enterprise/dashboard')
      if (!res.ok) throw new Error('Failed to fetch dashboard')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Dashboard" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading dashboard..." />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <PageHeader title="Dashboard" />
        <div className="p-4 text-status-urgent text-sm">
          Failed to load dashboard. Please try again.
        </div>
      </div>
    )
  }

  const pendingPayments = data.paymentsTotal - data.paymentsReleased

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" subtitle={`${data.activeProjectCount} active projects`} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GradientCard gradient="primary">
          <p className="text-sm font-body opacity-90">Tasks Complete</p>
          <p className="text-3xl font-display font-bold mt-1">{data.tasksCompletePercentage}%</p>
          <p className="text-xs font-body opacity-75 mt-1">across {data.activeProjectCount} active projects</p>
        </GradientCard>

        <GradientCard gradient="primary">
          <p className="text-sm font-body opacity-90">Evidence Packs Pending</p>
          <p className="text-3xl font-display font-bold mt-1">{data.evidencePacksPending}</p>
          <p className="text-xs font-body opacity-75 mt-1">awaiting your review</p>
        </GradientCard>

        <GradientCard
          style={{ background: 'linear-gradient(135deg, #4A6741 0%, #3A8FA0 100%)' }}
        >
          <p className="text-sm font-body opacity-90">Payments Released</p>
          <p className="text-3xl font-display font-bold mt-1">{formatCurrency(data.paymentsReleased)}</p>
          <p className="text-xs font-body opacity-75 mt-1">of {formatCurrency(data.paymentsTotal)} total</p>
        </GradientCard>

        <GradientCard gradient="nature">
          <p className="text-sm font-body opacity-90">Timeline Health</p>
          <p className="text-3xl font-display font-bold mt-1">On Track</p>
          <p className="text-xs font-body opacity-75 mt-1">{data.milestonesThisWeek} milestones this week</p>
        </GradientCard>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActiveProjectsWidget projects={data.activeProjects} />
        <Card>
          <CardHeader>
            <CardTitle>APG Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <APGFeed actions={data.recentActivity} maxVisible={5} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PendingActionsWidget actions={data.pendingActions} />
        <BudgetWidget
          released={data.paymentsReleased}
          pending={pendingPayments}
          total={data.paymentsTotal}
          currency={data.currency}
        />
        <HealthMetricsWidget
          onTimeDeliveryRate={94}
          reworkRate={8}
          avgReviewTime="1.2 days"
        />
      </div>
    </div>
  )
}
