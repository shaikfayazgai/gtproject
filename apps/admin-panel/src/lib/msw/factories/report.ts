import type { PlatformReportData, ReportType } from '@glimmora/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function platformOverviewData(): PlatformReportData {
  return {
    reportType: 'platform_overview',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    metrics: {
      total_users: 4280,
      active_projects: 156,
      system_uptime: '99.7%',
      avg_response_time: '142ms',
      open_disputes: 23,
      health_score: 94,
    },
    chartData: MONTHS.map((month) => ({
      month,
      active_users: Math.floor(Math.random() * 300 + 200),
      new_projects: Math.floor(Math.random() * 30 + 10),
    })),
  }
}

function userActivityData(): PlatformReportData {
  return {
    reportType: 'user_activity',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    metrics: {
      total_registrations: 1240,
      monthly_active: 856,
      retention_rate: '72%',
      avg_session_duration: '28m',
      women_contributors: 380,
      student_contributors: 620,
    },
    chartData: MONTHS.map((month) => ({
      month,
      registrations: Math.floor(Math.random() * 120 + 40),
      active: Math.floor(Math.random() * 200 + 100),
      churned: Math.floor(Math.random() * 30 + 5),
    })),
  }
}

function projectDeliveryData(): PlatformReportData {
  return {
    reportType: 'project_delivery',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    metrics: {
      total_delivered: 89,
      completion_rate: '87%',
      avg_delivery_time: '14.2d',
      quality_score: 4.3,
      on_time_rate: '78%',
      rework_rate: '12%',
    },
    chartData: MONTHS.map((month) => ({
      month,
      completed: Math.floor(Math.random() * 15 + 5),
      on_time: Math.floor(Math.random() * 12 + 3),
      delayed: Math.floor(Math.random() * 5),
    })),
  }
}

function financialData(): PlatformReportData {
  return {
    reportType: 'financial',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    metrics: {
      total_revenue: '$245,800',
      total_payouts: '$198,400',
      platform_fees: '$47,400',
      pending_payments: '$12,300',
      dispute_holds: '$3,200',
      avg_payout_time: '2.4d',
    },
    chartData: MONTHS.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 30000 + 15000),
      payouts: Math.floor(Math.random() * 25000 + 10000),
      fees: Math.floor(Math.random() * 6000 + 2000),
    })),
  }
}

function disputeAnalyticsData(): PlatformReportData {
  return {
    reportType: 'skill_growth',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    metrics: {
      total_disputes: 67,
      avg_resolution_time: '3.8d',
      resolved_rate: '89%',
      escalation_rate: '11%',
      favor_requester: '42%',
      favor_contributor: '47%',
    },
    chartData: MONTHS.map((month) => ({
      month,
      opened: Math.floor(Math.random() * 10 + 2),
      resolved: Math.floor(Math.random() * 8 + 2),
      escalated: Math.floor(Math.random() * 3),
    })),
  }
}

function podlLedgerData(): PlatformReportData {
  return {
    reportType: 'podl_ledger',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    metrics: {
      total_credentials: 342,
      verified: 298,
      pending: 31,
      revoked: 13,
      women_contributors: 128,
      student_contributors: 214,
    },
    chartData: [
      {
        credential_id: 'PODL-001',
        contributor: 'W-7A3F',
        user_type: 'Women',
        project: 'E-Commerce Platform',
        task: 'API Integration',
        skills: 'React, TypeScript, API Design',
        issued: '2026-02-15',
        status: 'Verified',
      },
      {
        credential_id: 'PODL-002',
        contributor: 'S-4B2E',
        user_type: 'Student',
        project: 'Healthcare Dashboard',
        task: 'Data Visualization',
        skills: 'D3.js, Python, SQL',
        issued: '2026-02-14',
        status: 'Verified',
      },
      {
        credential_id: 'PODL-003',
        contributor: 'W-9C1D',
        user_type: 'Women',
        project: 'Supply Chain Tracker',
        task: 'Database Schema Design',
        skills: 'PostgreSQL, Redis, Data Modeling',
        issued: '2026-02-12',
        status: 'Pending',
      },
      {
        credential_id: 'PODL-004',
        contributor: 'A-6E8F',
        user_type: 'Alumni',
        project: 'FinTech Mobile App',
        task: 'Payment Gateway Integration',
        skills: 'Node.js, Stripe API, Security',
        issued: '2026-02-10',
        status: 'Verified',
      },
      {
        credential_id: 'PODL-005',
        contributor: 'S-2D7A',
        user_type: 'Student',
        project: 'EdTech Platform',
        task: 'Frontend Components',
        skills: 'React, Tailwind CSS, Accessibility',
        issued: '2026-02-08',
        status: 'Verified',
      },
      {
        credential_id: 'PODL-006',
        contributor: 'W-5F3B',
        user_type: 'Women',
        project: 'Logistics Dashboard',
        task: 'Real-time Tracking Module',
        skills: 'WebSocket, MapboxGL, TypeScript',
        issued: '2026-02-06',
        status: 'Revoked',
      },
      {
        credential_id: 'PODL-007',
        contributor: 'S-8A4C',
        user_type: 'Student',
        project: 'CRM Integration',
        task: 'REST API Development',
        skills: 'NestJS, TypeORM, Testing',
        issued: '2026-02-04',
        status: 'Verified',
      },
      {
        credential_id: 'PODL-008',
        contributor: 'A-1G9H',
        user_type: 'Alumni',
        project: 'Insurance Claims System',
        task: 'Workflow Automation',
        skills: 'BullMQ, Redis, Event-driven Design',
        issued: '2026-02-02',
        status: 'Pending',
      },
    ],
  }
}

export function createMockReportData(type: string): PlatformReportData {
  switch (type as ReportType) {
    case 'platform_overview':
      return platformOverviewData()
    case 'user_activity':
      return userActivityData()
    case 'project_delivery':
      return projectDeliveryData()
    case 'financial':
      return financialData()
    case 'skill_growth':
      return disputeAnalyticsData()
    case 'podl_ledger':
      return podlLedgerData()
    default:
      return platformOverviewData()
  }
}
