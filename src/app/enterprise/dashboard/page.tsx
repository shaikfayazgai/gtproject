"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  AlertTriangle,
  ClipboardCheck,
  ShieldCheck,
  FileSearch,
  ArrowRight,
  ArrowUpRight,
  Users,
  CircleDollarSign,
  Activity,
  ChevronRight,
  Clock,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Zap,
  BarChart3,
  Eye,
  Bot,
  Upload,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge, Progress } from "@/components/ui";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import {
  mockProjects,
  mockDeliverables,
  mockPlans,
  mockMilestones,
} from "@/mocks/data/enterprise-projects";
import { mockSOWs } from "@/mocks/data/enterprise-sow";
import {
  mockInvoices,
  mockEscrowAccounts,
  billingStats,
} from "@/mocks/data/enterprise-billing";
import type { Project, ProjectHealth } from "@/types/enterprise";

/* ══════════════════════════════════════════
   Derived data from mocks
   ══════════════════════════════════════════ */

const activeProjects = mockProjects.filter((p) => p.health !== "completed");
const totalEscalations = mockProjects.reduce(
  (sum, p) => sum + p.escalations,
  0
);
const pendingDeliverables = mockDeliverables.filter(
  (d) => d.status === "pending"
);
const reworkDeliverables = mockDeliverables.filter(
  (d) => d.status === "rework"
);
const draftPlans = mockPlans.filter((p) => p.status === "draft");
const pendingApprovals = pendingDeliverables.length + draftPlans.length;
const avgSla = Math.round(
  mockProjects.reduce((sum, p) => sum + p.slaCompliance, 0) /
    mockProjects.length
);
const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);
const overdueInvoices = mockInvoices.filter((i) => i.status === "overdue");
const pendingInvoices = mockInvoices.filter((i) => i.status === "pending");
const sowsInApproval = mockSOWs.filter((s) => s.status === "approval");
const avgApgScore = Math.round(
  mockProjects.reduce((sum, p) => sum + p.apgScore, 0) / mockProjects.length
);

/* ══════════════════════════════════════════
   Health config
   ══════════════════════════════════════════ */

const healthConfig: Record<
  ProjectHealth,
  {
    label: string;
    dot: string;
    fill: string;
    text: string;
    badge: "forest" | "gold" | "danger" | "teal";
    bar: "forest" | "gold" | "brown" | "teal";
  }
> = {
  on_track: {
    label: "On Track",
    dot: "bg-forest-500",
    fill: "#4D5741",
    text: "text-forest-700",
    badge: "forest",
    bar: "forest",
  },
  at_risk: {
    label: "At Risk",
    dot: "bg-gold-500",
    fill: "#D0B060",
    text: "text-gold-800",
    badge: "gold",
    bar: "gold",
  },
  behind: {
    label: "Behind",
    dot: "bg-[var(--danger)]",
    fill: "#C4574A",
    text: "text-[var(--danger)]",
    badge: "danger",
    bar: "brown",
  },
  completed: {
    label: "Completed",
    dot: "bg-teal-500",
    fill: "#5B9BA2",
    text: "text-teal-700",
    badge: "teal",
    bar: "teal",
  },
};

/* ══════════════════════════════════════════
   Portfolio Health Donut
   ══════════════════════════════════════════ */

function PortfolioDonut() {
  const counts: Record<ProjectHealth, number> = {
    on_track: 0,
    at_risk: 0,
    behind: 0,
    completed: 0,
  };
  mockProjects.forEach((p) => counts[p.health]++);
  const total = mockProjects.length;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const allSegments = [
    { health: "on_track" as ProjectHealth, count: counts.on_track },
    { health: "at_risk" as ProjectHealth, count: counts.at_risk },
    { health: "behind" as ProjectHealth, count: counts.behind },
    { health: "completed" as ProjectHealth, count: counts.completed },
  ];
  const segments = allSegments.filter((s) => s.count > 0);

  let offset = 0;
  const arcs = segments.map((seg) => {
    const len = (seg.count / total) * circ;
    const arc = { ...seg, dasharray: `${len} ${circ - len}`, offset };
    offset += len;
    return arc;
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden>
        <circle
          cx="54"
          cy="54"
          r={r}
          fill="none"
          stroke="#F0EBE5"
          strokeWidth="10"
        />
        {arcs.map((arc) => (
          <circle
            key={arc.health}
            cx="54"
            cy="54"
            r={r}
            fill="none"
            stroke={healthConfig[arc.health].fill}
            strokeWidth="10"
            strokeDasharray={arc.dasharray}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
            transform="rotate(-90 54 54)"
            className="transition-all duration-700"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-heading font-bold text-brown-950 leading-none">
          {total}
        </span>
        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
          Projects
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Mini Sparkline Area Chart
   ══════════════════════════════════════════ */

function SpendSparkline() {
  const data = billingStats.monthlySpend;
  const max = Math.max(...data.map((d) => d.amount));
  const h = 48;
  const w = 180;
  const stepX = w / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: h - (d.amount / max) * (h - 8) - 4,
  }));

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaD = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-12"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="spend-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67763" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#A67763" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#spend-gradient)" />
      <path
        d={d}
        fill="none"
        stroke="#A67763"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current month dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3.5"
        fill="#A67763"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════
   Budget Utilization Ring
   ══════════════════════════════════════════ */

function BudgetRing({
  value,
  size = 52,
  strokeWidth = 5,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const center = size / 2;
  const color =
    value <= 50 ? "#4D5741" : value <= 75 ? "#D0B060" : "#C4574A";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="#F0EBE5"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        className="transition-all duration-700"
      />
      <text
        x={center}
        y={center + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[11px] font-bold"
        fill="#6B5A4E"
      >
        {value}%
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════
   SLA Gauge
   ══════════════════════════════════════════ */

function SlaGauge({ value }: { value: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color =
    value >= 90 ? "#4D5741" : value >= 80 ? "#D0B060" : "#C4574A";

  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden>
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="#F0EBE5"
        strokeWidth="4.5"
      />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4.5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        className="transition-all duration-700"
      />
      <text
        x="26"
        y="27"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[11px] font-bold"
        fill="#6B5A4E"
      >
        {value}%
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════
   Attention Item
   ══════════════════════════════════════════ */

interface AttentionItem {
  id: string;
  title: string;
  description: string;
  urgency: "critical" | "high" | "medium";
  type: "approval" | "escalation" | "overdue" | "rework" | "sow";
  href: string;
  time: string;
}

const attentionItems: AttentionItem[] = [
  ...(overdueInvoices.length > 0
    ? [
        {
          id: "att-overdue",
          title: `${overdueInvoices.length} Overdue Invoice${overdueInvoices.length > 1 ? "s" : ""}`,
          description: `$${overdueInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()} past due — requires immediate attention`,
          urgency: "critical" as const,
          type: "overdue" as const,
          href: "/enterprise/billing/invoices",
          time: "Overdue",
        },
      ]
    : []),
  ...(totalEscalations > 0
    ? [
        {
          id: "att-escalations",
          title: `${totalEscalations} Active Escalation${totalEscalations > 1 ? "s" : ""}`,
          description: `APG flagged issues across ${activeProjects.filter((p) => p.escalations > 0).length} projects`,
          urgency: "critical" as const,
          type: "escalation" as const,
          href: "/enterprise/projects",
          time: "Active",
        },
      ]
    : []),
  ...(reworkDeliverables.length > 0
    ? [
        {
          id: "att-rework",
          title: `${reworkDeliverables.length} Rework Request${reworkDeliverables.length > 1 ? "s" : ""}`,
          description: reworkDeliverables.map((d) => d.title).join(", "),
          urgency: "high" as const,
          type: "rework" as const,
          href: "/enterprise/review",
          time: "In progress",
        },
      ]
    : []),
  ...(pendingDeliverables.length > 0
    ? [
        {
          id: "att-deliverables",
          title: `${pendingDeliverables.length} Pending Review${pendingDeliverables.length > 1 ? "s" : ""}`,
          description: pendingDeliverables
            .slice(0, 2)
            .map((d) => d.title)
            .join(", "),
          urgency: "high" as const,
          type: "approval" as const,
          href: "/enterprise/review",
          time: "Awaiting",
        },
      ]
    : []),
  ...(sowsInApproval.length > 0
    ? [
        {
          id: "att-sow",
          title: `SOW Approval: ${sowsInApproval[0].title}`,
          description: `Legal review in progress — ${sowsInApproval[0].client}`,
          urgency: "medium" as const,
          type: "sow" as const,
          href: `/enterprise/sow/${sowsInApproval[0].id}/approve`,
          time: "In review",
        },
      ]
    : []),
  ...(draftPlans.length > 0
    ? [
        {
          id: "att-plans",
          title: `${draftPlans.length} Decomposition Plan${draftPlans.length > 1 ? "s" : ""} Draft`,
          description: draftPlans.map((p) => p.title).join(", "),
          urgency: "medium" as const,
          type: "approval" as const,
          href: "/enterprise/decomposition",
          time: "Draft",
        },
      ]
    : []),
];

const urgencyConfig = {
  critical: {
    bg: "bg-red-50/80",
    border: "border-red-200/50",
    dot: "bg-[var(--danger)]",
    text: "text-[var(--danger)]",
    label: "Critical",
  },
  high: {
    bg: "bg-gold-50/50",
    border: "border-gold-200/50",
    dot: "bg-gold-500",
    text: "text-gold-700",
    label: "High",
  },
  medium: {
    bg: "bg-white/50",
    border: "border-beige-200/50",
    dot: "bg-teal-500",
    text: "text-teal-600",
    label: "Medium",
  },
};

const typeIcon = {
  approval: ClipboardCheck,
  escalation: AlertTriangle,
  overdue: CircleDollarSign,
  rework: RotateCcw,
  sow: FileText,
};

/* ══════════════════════════════════════════
   Activity events
   ══════════════════════════════════════════ */

const activityEvents = [
  {
    id: "ev-1",
    contributor: "Contributor D-2M",
    initials: "D2",
    action: "submitted evidence for",
    target: mockDeliverables[0].title,
    time: "2h ago",
    gradient: "from-teal-400 to-teal-600",
    icon: Upload,
  },
  {
    id: "ev-2",
    contributor: "Contributor A-7X",
    initials: "A7",
    action: "submitted deliverable",
    target: mockDeliverables[1].title,
    time: "5h ago",
    gradient: "from-forest-400 to-forest-600",
    icon: CheckCircle2,
  },
  {
    id: "ev-3",
    contributor: "Contributor B-3K",
    initials: "B3",
    action: "submitted for review",
    target: mockDeliverables[5].title,
    time: "1d ago",
    gradient: "from-brown-400 to-brown-600",
    icon: FileSearch,
  },
  {
    id: "ev-4",
    contributor: "APG System",
    initials: "AG",
    action: "flagged escalation on",
    target: "Mobile Banking App",
    time: "1d ago",
    gradient: "from-gold-400 to-gold-600",
    icon: Zap,
  },
  {
    id: "ev-5",
    contributor: "Contributor C-9R",
    initials: "C9",
    action: "completed milestone",
    target: "Infrastructure & Auth",
    time: "2d ago",
    gradient: "from-teal-500 to-forest-500",
    icon: CheckCircle2,
  },
];

/* ══════════════════════════════════════════
   Greeting
   ══════════════════════════════════════════ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ══════════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════════ */

export default function EnterpriseDashboardPage() {
  const greeting = getGreeting();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1360px] mx-auto space-y-6"
    >
      {/* ═══════════════════════════════════
          HERO: Greeting + Portfolio Health
          ═══════════════════════════════════ */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden"
      >
        {/* Ambient decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[300px] h-[300px] rounded-full bg-brown-100/20 blur-[80px] -top-[80px] right-[10%]" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-teal-100/15 blur-[60px] bottom-[-40px] left-[5%]" />
        </div>

        <div className="relative z-10 px-7 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Greeting + summary */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                  Enterprise Console
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-[28px] font-heading font-bold text-brown-950 tracking-[-0.02em] leading-tight">
                {greeting}, Priya
              </h1>
              <p className="text-[14px] text-gray-500 mt-1.5 leading-relaxed max-w-lg">
                {attentionItems.length > 0 ? (
                  <>
                    You have{" "}
                    <span className="font-semibold text-brown-700">
                      {attentionItems.length} item
                      {attentionItems.length > 1 ? "s" : ""}
                    </span>{" "}
                    requiring attention across your portfolio.
                  </>
                ) : (
                  "All systems operational. Your portfolio is in good shape."
                )}
              </p>

              {/* Quick health legend */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {(
                  [
                    "on_track",
                    "at_risk",
                    "behind",
                    "completed",
                  ] as ProjectHealth[]
                ).map((health) => {
                  const count = mockProjects.filter(
                    (p) => p.health === health
                  ).length;
                  if (count === 0) return null;
                  const cfg = healthConfig[health];
                  return (
                    <div key={health} className="flex items-center gap-1.5">
                      <div
                        className={cn("w-2 h-2 rounded-full", cfg.dot)}
                      />
                      <span className="text-[12px] text-gray-500">
                        <span className={cn("font-semibold", cfg.text)}>
                          {count}
                        </span>{" "}
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Donut + key metrics */}
            <div className="flex items-center gap-6 lg:gap-8">
              <PortfolioDonut />
              <div className="hidden sm:grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brown-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-brown-500" />
                  </div>
                  <div>
                    <p className="text-[18px] font-heading font-bold text-brown-950 leading-none">
                      {avgSla}%
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Avg SLA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-forest-600" />
                  </div>
                  <div>
                    <p className="text-[18px] font-heading font-bold text-brown-950 leading-none">
                      {avgApgScore}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      APG Score
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════
          KPI BENTO: 4 metric cards
          ═══════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <motion.div
          variants={scaleIn}
          className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-forest-100/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
              <FolderKanban className="w-3.5 h-3.5 text-forest-600" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Active
            </span>
          </div>
          <p className="text-[28px] font-heading font-bold text-brown-950 tracking-tight leading-none">
            {activeProjects.length}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp className="w-3 h-3 text-forest-500" />
            <span className="text-[11px] text-forest-600 font-medium">
              +1 this month
            </span>
          </div>
        </motion.div>

        {/* Escalations */}
        <motion.div
          variants={scaleIn}
          className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-gold-100/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-gold-600" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Exceptions
            </span>
          </div>
          <p className="text-[28px] font-heading font-bold text-brown-950 tracking-tight leading-none">
            {totalEscalations}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-gold-600 font-medium">
              Across{" "}
              {activeProjects.filter((p) => p.escalations > 0).length} projects
            </span>
          </div>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          variants={scaleIn}
          className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-teal-100/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <ClipboardCheck className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Approvals
            </span>
          </div>
          <p className="text-[28px] font-heading font-bold text-brown-950 tracking-tight leading-none">
            {pendingApprovals}
          </p>
          <Link
            href="/enterprise/review"
            className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Review now
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Budget */}
        <motion.div
          variants={scaleIn}
          className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-brown-100/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-brown-50 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-brown-500" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Budget Used
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[28px] font-heading font-bold text-brown-950 tracking-tight leading-none">
              ${Math.round(totalSpent / 1000)}k
            </p>
            <BudgetRing value={budgetUtilization} size={44} strokeWidth={4} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            of ${Math.round(totalBudget / 1000)}k total
          </p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════
          MAIN GRID: Attention + Projects
          ═══════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── Needs Your Attention ── */}
        <motion.div variants={fadeUp} className="lg:col-span-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brown-400" />
              <h2 className="text-[15px] font-heading font-semibold text-brown-900">
                Needs Your Attention
              </h2>
            </div>
            <Badge variant="beige" size="sm">
              {attentionItems.length}
            </Badge>
          </div>

          <div className="space-y-2.5">
            {attentionItems.map((item, i) => {
              const urg = urgencyConfig[item.urgency];
              const TypeIcon = typeIcon[item.type];
              return (
                <motion.div key={item.id} variants={fadeUp}>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "group relative rounded-xl border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
                        urg.bg,
                        urg.border
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                            item.urgency === "critical"
                              ? "bg-red-100"
                              : item.urgency === "high"
                                ? "bg-gold-100"
                                : "bg-gray-100"
                          )}
                        >
                          <TypeIcon
                            className={cn(
                              "w-4 h-4",
                              item.urgency === "critical"
                                ? "text-[var(--danger)]"
                                : item.urgency === "high"
                                  ? "text-gold-600"
                                  : "text-gray-500"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[13px] font-semibold text-brown-900 truncate">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={cn(
                              "text-[9px] font-bold uppercase tracking-wider",
                              urg.text
                            )}
                          >
                            {item.time}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brown-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {attentionItems.length === 0 && (
              <div className="rounded-xl border border-forest-200/50 bg-forest-50/30 p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-forest-400 mx-auto mb-2" />
                <p className="text-[13px] font-semibold text-forest-700">
                  All clear
                </p>
                <p className="text-[11px] text-forest-500 mt-0.5">
                  No items require your immediate attention
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Active Projects ── */}
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brown-400" />
              <h2 className="text-[15px] font-heading font-semibold text-brown-900">
                Project Pipeline
              </h2>
            </div>
            <Link
              href="/enterprise/projects"
              className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden">
            {mockProjects.map((project, i) => {
              const h = healthConfig[project.health];
              const budgetPct = Math.round(
                (project.spent / project.budget) * 100
              );
              return (
                <Link
                  key={project.id}
                  href={`/enterprise/projects/${project.id}`}
                >
                  <div
                    className={cn(
                      "group flex items-center gap-4 px-5 py-4 hover:bg-beige-50/40 transition-colors cursor-pointer",
                      i < mockProjects.length - 1 &&
                        "border-b border-beige-100/60"
                    )}
                  >
                    {/* Health indicator bar */}
                    <div
                      className={cn(
                        "w-1 h-10 rounded-full shrink-0",
                        h.dot
                      )}
                    />

                    {/* Project info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-brown-900 truncate group-hover:text-brown-950 transition-colors">
                          {project.title}
                        </h3>
                        <Badge variant={h.badge} size="sm">
                          {h.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-gray-400">
                          {project.client}
                        </span>
                        <span className="text-gray-200">·</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-300" />
                          <span className="text-[11px] text-gray-400">
                            {project.teamSize}
                          </span>
                        </div>
                        {project.escalations > 0 && (
                          <>
                            <span className="text-gray-200">·</span>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-gold-500" />
                              <span className="text-[11px] text-gold-600 font-medium">
                                {project.escalations}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress section */}
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="w-28">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-gray-400">
                            Progress
                          </span>
                          <span className="text-[11px] font-bold text-brown-800 font-mono">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress
                          value={project.progress}
                          size="sm"
                          variant={h.bar}
                        />
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-brown-800">
                          ${Math.round(project.spent / 1000)}k
                        </p>
                        <p className="text-[10px] text-gray-400">
                          of ${Math.round(project.budget / 1000)}k
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brown-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════
          BOTTOM ROW: Financial + Activity
          ═══════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── Financial Snapshot ── */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-5 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brown-400" />
              <h2 className="text-[15px] font-heading font-semibold text-brown-900">
                Financial Snapshot
              </h2>
            </div>
            <Link
              href="/enterprise/billing"
              className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Spend trend */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-gray-400 font-medium">
                Monthly Spend Trend
              </span>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-forest-500" />
                <span className="text-[11px] text-forest-600 font-semibold">
                  -48% this month
                </span>
              </div>
            </div>
            <SpendSparkline />
            <div className="flex justify-between mt-1">
              {billingStats.monthlySpend.map((m) => (
                <span
                  key={m.month}
                  className="text-[9px] text-gray-300 font-medium"
                >
                  {m.month}
                </span>
              ))}
            </div>
          </div>

          {/* Key financial metrics */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-beige-100/60">
            <div className="rounded-xl bg-beige-50/60 p-3">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                Escrow Held
              </p>
              <p className="text-[16px] font-heading font-bold text-brown-950">
                $
                {Math.round(
                  mockEscrowAccounts.reduce((s, e) => s + e.totalHeld, 0) /
                    1000
                )}
                k
              </p>
            </div>
            <div className="rounded-xl bg-beige-50/60 p-3">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                Pending Pay
              </p>
              <p className="text-[16px] font-heading font-bold text-brown-950">
                $
                {Math.round(
                  pendingInvoices.reduce((s, i) => s + i.amount, 0) / 1000
                )}
                k
              </p>
            </div>
            <div className="rounded-xl bg-beige-50/60 p-3">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                Total Paid
              </p>
              <p className="text-[16px] font-heading font-bold text-brown-950">
                ${Math.round(billingStats.totalSpent / 1000)}k
              </p>
            </div>
            {overdueInvoices.length > 0 ? (
              <div className="rounded-xl bg-red-50/40 border border-red-200/30 p-3">
                <p className="text-[10px] text-[var(--danger)] font-medium uppercase tracking-wider mb-1">
                  Overdue
                </p>
                <p className="text-[16px] font-heading font-bold text-[var(--danger)]">
                  $
                  {Math.round(
                    overdueInvoices.reduce((s, i) => s + i.amount, 0) / 1000
                  )}
                  k
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-forest-50/40 p-3">
                <p className="text-[10px] text-forest-600 font-medium uppercase tracking-wider mb-1">
                  Overdue
                </p>
                <p className="text-[16px] font-heading font-bold text-forest-700">
                  $0
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Activity Feed ── */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-7 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brown-400" />
              <h2 className="text-[15px] font-heading font-semibold text-brown-900">
                Recent Activity
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500" />
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                Live
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {activityEvents.map((event, i) => {
              const EventIcon = event.icon;
              return (
                <motion.div
                  key={event.id}
                  variants={fadeUp}
                  className="flex items-start gap-3 py-3 group"
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                        event.gradient
                      )}
                    >
                      <EventIcon className="w-4 h-4 text-white" />
                    </div>
                    {i < activityEvents.length - 1 && (
                      <div className="w-px h-full min-h-[12px] bg-beige-200/50 mt-1.5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      <span className="font-semibold text-brown-800">
                        {event.contributor}
                      </span>{" "}
                      {event.action}{" "}
                      <span className="font-semibold text-brown-800">
                        {event.target}
                      </span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span className="text-[11px] text-gray-400">
                        {event.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-beige-100/60">
            <Link
              href="/enterprise/audit"
              className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
            >
              View full audit log
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════
          SOW PIPELINE — quick status strip
          ═══════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brown-400" />
            <h2 className="text-[15px] font-heading font-semibold text-brown-900">
              SOW Pipeline
            </h2>
          </div>
          <Link
            href="/enterprise/sow"
            className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
            Manage SOWs
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {mockSOWs.slice(0, 5).map((sow) => {
            const statusConfig: Record<
              string,
              { bg: string; text: string; icon: React.ElementType }
            > = {
              draft: {
                bg: "bg-gray-100",
                text: "text-gray-600",
                icon: FileText,
              },
              parsing: {
                bg: "bg-teal-100",
                text: "text-teal-700",
                icon: Bot,
              },
              review: {
                bg: "bg-gold-100",
                text: "text-gold-700",
                icon: Eye,
              },
              approval: {
                bg: "bg-brown-100",
                text: "text-brown-700",
                icon: ClipboardCheck,
              },
              approved: {
                bg: "bg-forest-100",
                text: "text-forest-700",
                icon: CheckCircle2,
              },
              archived: {
                bg: "bg-beige-200",
                text: "text-beige-600",
                icon: FileText,
              },
            };
            const sc = statusConfig[sow.status] || statusConfig.draft;
            const StatusIcon = sc.icon;

            return (
              <Link key={sow.id} href={`/enterprise/sow/${sow.id}`}>
                <motion.div
                  variants={scaleIn}
                  className="group rounded-xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center",
                        sc.bg
                      )}
                    >
                      <StatusIcon className={cn("w-3 h-3", sc.text)} />
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-bold uppercase tracking-wider",
                        sc.text
                      )}
                    >
                      {sow.status}
                    </span>
                  </div>
                  <h3 className="text-[12px] font-semibold text-brown-900 truncate group-hover:text-brown-950 transition-colors">
                    {sow.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                    {sow.client}
                  </p>

                  {sow.riskScore.overall > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-beige-100/60">
                      <span className="text-[10px] text-gray-400">Risk</span>
                      <div className="flex-1 h-1 rounded-full bg-beige-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            sow.riskScore.overall <= 30
                              ? "bg-forest-500"
                              : sow.riskScore.overall <= 60
                                ? "bg-gold-500"
                                : "bg-[var(--danger)]"
                          )}
                          style={{
                            width: `${Math.min(sow.riskScore.overall, 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold font-mono",
                          sow.riskScore.overall <= 30
                            ? "text-forest-600"
                            : sow.riskScore.overall <= 60
                              ? "text-gold-600"
                              : "text-[var(--danger)]"
                        )}
                      >
                        {sow.riskScore.overall}
                      </span>
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
