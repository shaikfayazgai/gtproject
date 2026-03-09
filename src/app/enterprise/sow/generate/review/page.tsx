"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Brain,
  Sparkles,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Scale,
  Search,
  ScanEye,
  GitCompare,
  BarChart3,
  CircleDot,
  ArrowRight,
  RefreshCcw,
  PenLine,
  Send,
  Users,
  CalendarDays,
  Bug,
  Lightbulb,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, slideInRight } from "@/lib/utils/motion-variants";
import {
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Textarea,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";

/* ═══════════════════════════════════════════════════════════
   MOCK DATA — Healthcare Patient Portal (sow-004)
   ═══════════════════════════════════════════════════════════ */

const sowMeta = {
  id: "sow-004",
  title: "Healthcare Patient Portal",
  client: "MedFirst Health Systems",
  generatedAt: "2026-03-07T14:32:00Z",
  overallConfidence: 92,
  riskScore: 18,
  hallucinationFlags: 2,
  completeness: 96,
};

const generatedSections = [
  {
    id: "sec-1",
    title: "Executive Summary",
    confidence: 96,
    content:
      "This project delivers a secure, HIPAA-compliant patient portal enabling MedFirst Health Systems' 2.4 million active patients to manage appointments, view medical records, communicate with providers, and process payments. The platform integrates with Epic EHR via FHIR R4 APIs, supports real-time telehealth video, and includes a mobile-responsive Progressive Web App. Target launch: Q3 2026 with phased rollout across 14 regional facilities.",
  },
  {
    id: "sec-2",
    title: "Project Scope",
    confidence: 94,
    content:
      "In-scope: Patient registration and identity verification (KYC/KYB), appointment scheduling with provider availability sync, secure messaging (asynchronous + real-time), medical records viewer with lab results and imaging, prescription refill requests, billing and payment processing (Stripe integration), telehealth video consultations (WebRTC), push notifications and reminders, multi-language support (English, Spanish, Mandarin), accessibility (WCAG 2.1 AA). Out-of-scope: EMR data migration, insurance claim adjudication, provider-side administrative tools, medical device integrations.",
  },
  {
    id: "sec-3",
    title: "Technical Requirements",
    confidence: 91,
    content:
      "Frontend: React 18+ with TypeScript, Next.js App Router, Tailwind CSS. Backend: Node.js/NestJS microservices, PostgreSQL 16 with row-level security, Redis for session management, S3-compatible storage for documents. Security: OAuth 2.0 / OIDC with Keycloak, MFA enforcement, AES-256 encryption at rest, TLS 1.3 in transit. Infrastructure: AWS (us-east-1 primary, us-west-2 DR), Kubernetes (EKS), Terraform IaC, CI/CD via GitHub Actions. Integrations: Epic FHIR R4, Twilio (SMS/Voice), Stripe (Payments), SendGrid (Email), Vonage (Video).",
  },
  {
    id: "sec-4",
    title: "Timeline & Milestones",
    confidence: 88,
    content:
      "Phase 1 (Weeks 1-6): Core infrastructure, authentication, patient registration. Phase 2 (Weeks 7-14): Appointment scheduling, medical records viewer, secure messaging. Phase 3 (Weeks 15-20): Telehealth, billing/payments, prescription management. Phase 4 (Weeks 21-24): UAT, security audit, performance optimization, staged rollout. Total duration: 24 weeks. Key milestones: Architecture review (Week 2), MVP demo (Week 10), Security penetration test (Week 20), Go-live (Week 24).",
  },
  {
    id: "sec-5",
    title: "Budget Breakdown",
    confidence: 82,
    content:
      "Total estimated budget: $1,240,000. Engineering (60%): $744,000 — includes 8 senior engineers, 4 mid-level, 2 QA. Design (10%): $124,000 — UX research, UI design, accessibility audit. Infrastructure (15%): $186,000 — AWS hosting, CDN, monitoring, DR setup. Security & Compliance (10%): $124,000 — penetration testing, HIPAA audit, SOC 2 preparation. Project Management (5%): $62,000 — Scrum master, stakeholder coordination. Contingency: 12% buffer included in line items.",
  },
  {
    id: "sec-6",
    title: "Team Composition",
    confidence: 93,
    content:
      "Project Lead: 1 senior technical PM. Architecture: 1 solutions architect (HIPAA-experienced). Frontend: 3 senior React developers, 2 mid-level. Backend: 3 senior NestJS developers, 2 mid-level. DevOps: 1 senior SRE, 1 cloud engineer. QA: 2 automation engineers (Playwright + API). Security: 1 dedicated security engineer. UX: 1 senior UX designer, 1 accessibility specialist. Total: 18 team members across delivery.",
  },
  {
    id: "sec-7",
    title: "Quality Standards & SLAs",
    confidence: 95,
    content:
      "Availability: 99.95% uptime (excluding planned maintenance). Performance: P95 page load < 2s, API response < 200ms. Security: Zero critical/high vulnerabilities at launch, monthly vulnerability scans. Testing: Minimum 85% code coverage, automated E2E for all critical paths. Accessibility: WCAG 2.1 AA compliance verified by independent audit. Data: RPO < 1 hour, RTO < 4 hours. Support: 24/7 for critical issues, 8-hour SLA for high priority.",
  },
  {
    id: "sec-8",
    title: "Security & Compliance",
    confidence: 97,
    content:
      "HIPAA BAA with all subprocessors. PHI encrypted at rest (AES-256) and in transit (TLS 1.3). Role-based access control with principle of least privilege. Audit logging for all data access events (immutable, 7-year retention). Multi-factor authentication mandatory for all users. Session timeout: 15 minutes idle, 8 hours absolute. Annual penetration testing by CREST-certified firm. SOC 2 Type II certification targeted within 12 months of launch. Data residency: US-only, no cross-border transfers.",
  },
];

const hallucinationLayers = [
  {
    id: "layer-1",
    name: "Input Validation",
    description: "Verified all input parameters against schema constraints and business rules",
    status: "passed" as const,
    score: 100,
    details: "All 23 input fields validated. No schema violations detected. Data types, ranges, and format constraints all satisfied.",
  },
  {
    id: "layer-2",
    name: "Template Locking",
    description: "Ensured generated output follows approved SOW template structure",
    status: "passed" as const,
    score: 100,
    details: "All 8 mandatory sections present. Section ordering matches MedFirst template v3.2. No unauthorized sections injected.",
  },
  {
    id: "layer-3",
    name: "Clause Library Matching",
    description: "Cross-referenced generated clauses against approved clause library",
    status: "warning" as const,
    score: 85,
    details: "42 of 44 clauses matched. 2 clauses generated from context inference rather than library: budget contingency clause and telehealth SLA clause.",
  },
  {
    id: "layer-4",
    name: "Completeness Checks",
    description: "Validated all required deliverables and acceptance criteria are present",
    status: "passed" as const,
    score: 96,
    details: "96% completeness. All critical sections present. Minor gap: disaster recovery testing frequency not explicitly stated.",
  },
  {
    id: "layer-5",
    name: "Confidence Scoring",
    description: "Statistical confidence analysis across all generated content",
    status: "passed" as const,
    score: 92,
    details: "Overall 92% confidence exceeds 90% threshold. 7 of 8 sections above 90%. Budget section at 82% — flagged for human review.",
  },
  {
    id: "layer-6",
    name: "Pattern Matching",
    description: "Compared against historical SOW patterns for anomaly detection",
    status: "warning" as const,
    score: 88,
    details: "1 unusual pattern detected: Budget allocation for security (10%) is lower than healthcare industry median (14%). Flagged for review.",
  },
  {
    id: "layer-7",
    name: "Human Approval Gate",
    description: "Requires human verification before final submission",
    status: "pending" as const,
    score: 0,
    details: "Awaiting human review and approval. This layer cannot be automated — requires explicit sign-off from authorized approver.",
  },
  {
    id: "layer-8",
    name: "Audit Logging",
    description: "Immutable record of all AI generation steps and decisions",
    status: "active" as const,
    score: 100,
    details: "All 847 generation steps logged with timestamps, model versions, and confidence deltas. Audit trail exportable for compliance.",
  },
];

const hallucinationFlags = [
  {
    id: "flag-1",
    severity: "medium" as const,
    section: "Budget Breakdown",
    clause: "Contingency: 12% buffer included in line items.",
    reason: "This contingency percentage was not specified in the input parameters. The AI inferred 12% based on project complexity scoring, but no explicit contingency requirement was provided.",
    suggestion: "Verify the 12% contingency rate aligns with MedFirst's procurement policy. Healthcare projects typically range 10-20%. Consider adjusting based on organization standards.",
    resolved: false,
  },
  {
    id: "flag-2",
    severity: "low" as const,
    section: "Timeline & Milestones",
    clause: "Security penetration test (Week 20)",
    reason: "Penetration test timing was auto-scheduled based on phase completion patterns. The original parameters did not specify when security testing should occur.",
    suggestion: "Week 20 allows 4 weeks of buffer before go-live. Consider if this aligns with your security team's availability and remediation timeline.",
    resolved: false,
  },
  {
    id: "flag-3",
    severity: "high" as const,
    section: "Budget Breakdown",
    clause: "Security & Compliance (10%): $124,000",
    reason: "The security budget allocation (10%) is significantly below the healthcare industry median of 14% for HIPAA-regulated patient portals. This could indicate insufficient security investment.",
    suggestion: "Increase security allocation to at least 14% ($173,600). Healthcare breaches average $10.9M per incident. Recommended: add dedicated HIPAA compliance officer and expand penetration testing scope.",
    resolved: false,
  },
];

const riskBreakdown = [
  { category: "Completeness", weight: 30, score: 28, maxScore: 30 },
  { category: "Confidence", weight: 25, score: 22, maxScore: 25 },
  { category: "Compliance", weight: 25, score: 23, maxScore: 25 },
  { category: "Pattern Match", weight: 20, score: 18, maxScore: 20 },
];

const comparisonSections = [
  {
    id: "cmp-1",
    label: "Project Duration",
    input: "6 months estimated delivery window with phased rollout",
    generated: "24 weeks (approximately 6 months) with 4 distinct phases: Infrastructure (6 wks), Core Features (8 wks), Advanced Features (6 wks), Launch (4 wks)",
    match: "high" as const,
  },
  {
    id: "cmp-2",
    label: "Budget",
    input: "Approximately $1.2M total budget, flexible on allocation",
    generated: "$1,240,000 allocated across Engineering (60%), Design (10%), Infrastructure (15%), Security (10%), PM (5%) with 12% contingency buffer",
    match: "high" as const,
  },
  {
    id: "cmp-3",
    label: "Security Requirements",
    input: "HIPAA compliance mandatory, SOC 2 desired, standard encryption",
    generated: "Full HIPAA BAA coverage, AES-256 at rest, TLS 1.3 in transit, SOC 2 Type II within 12 months, CREST-certified annual pen testing, 7-year audit log retention",
    match: "expanded" as const,
  },
  {
    id: "cmp-4",
    label: "Team Size",
    input: "15-20 team members across disciplines",
    generated: "18 team members: 1 PM, 1 Architect, 5 Frontend, 5 Backend, 2 DevOps, 2 QA, 1 Security, 1 UX Designer, 1 Accessibility Specialist",
    match: "high" as const,
  },
];

/* ═══════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

function confidenceRingColor(c: number): "forest" | "teal" | "gold" {
  if (c >= 90) return "forest";
  if (c >= 75) return "teal";
  return "gold";
}

function severityConfig(s: "high" | "medium" | "low") {
  switch (s) {
    case "high":
      return {
        label: "High",
        dot: "bg-[var(--danger,#c44)]",
        text: "text-[var(--danger,#c44)]",
        bg: "bg-[var(--danger,#c44)]/10",
        border: "border-[var(--danger,#c44)]/20",
        badge: "brown" as const,
      };
    case "medium":
      return {
        label: "Medium",
        dot: "bg-gold-500",
        text: "text-gold-700",
        bg: "bg-gold-50",
        border: "border-gold-200/60",
        badge: "gold" as const,
      };
    case "low":
      return {
        label: "Low",
        dot: "bg-beige-400",
        text: "text-beige-600",
        bg: "bg-beige-50",
        border: "border-beige-200",
        badge: "beige" as const,
      };
  }
}

function layerStatusConfig(s: "passed" | "warning" | "pending" | "active") {
  switch (s) {
    case "passed":
      return {
        label: "Passed",
        variant: "forest" as const,
        icon: CheckCircle2,
        ring: "ring-forest-200",
        bg: "bg-forest-50",
        iconColor: "text-forest-600",
      };
    case "warning":
      return {
        label: "Warning",
        variant: "gold" as const,
        icon: AlertTriangle,
        ring: "ring-gold-200",
        bg: "bg-gold-50",
        iconColor: "text-gold-600",
      };
    case "pending":
      return {
        label: "Pending",
        variant: "beige" as const,
        icon: Clock,
        ring: "ring-beige-200",
        bg: "bg-beige-100",
        iconColor: "text-beige-500",
      };
    case "active":
      return {
        label: "Active",
        variant: "teal" as const,
        icon: CircleDot,
        ring: "ring-teal-200",
        bg: "bg-teal-50",
        iconColor: "text-teal-600",
      };
  }
}

function riskLevelLabel(score: number) {
  if (score <= 30) return { label: "Low Risk", color: "text-forest-700", bg: "bg-forest-100", variant: "forest" as const };
  if (score <= 60) return { label: "Medium Risk", color: "text-gold-700", bg: "bg-gold-100", variant: "gold" as const };
  return { label: "High Risk", color: "text-[var(--danger,#c44)]", bg: "bg-[var(--danger,#c44)]/10", variant: "brown" as const };
}

function matchBadge(m: "high" | "expanded" | "partial" | "low") {
  switch (m) {
    case "high":
      return { label: "High Match", variant: "forest" as const };
    case "expanded":
      return { label: "AI Expanded", variant: "teal" as const };
    case "partial":
      return { label: "Partial Match", variant: "gold" as const };
    case "low":
      return { label: "Low Match", variant: "brown" as const };
  }
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function SOWAIDraftReviewPage() {
  const router = useRouter();
  const [resolvedFlags, setResolvedFlags] = React.useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = React.useState(false);
  const [showChangesDialog, setShowChangesDialog] = React.useState(false);
  const [changesFeedback, setChangesFeedback] = React.useState("");
  const [showRejectDialog, setShowRejectDialog] = React.useState(false);

  const toggleResolve = (id: string) => {
    setResolvedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unresolvedCount = hallucinationFlags.filter((f) => !resolvedFlags.has(f.id)).length;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1400px] mx-auto space-y-6 pb-28"
    >
      {/* ───── Back Link ───── */}
      <motion.div variants={fadeUp}>
        <Link
          href="/enterprise/sow/generate"
          className="inline-flex items-center gap-2 text-sm text-beige-600 hover:text-brown-700 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to SOW Generation
        </Link>
      </motion.div>

      {/* ───── Header ───── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center shrink-0 shadow-lg shadow-brown-200/40">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brown-900 tracking-tight font-heading">
              AI Draft Review
            </h1>
            <p className="text-sm text-beige-600 mt-0.5 max-w-2xl">
              Review the AI-generated SOW for{" "}
              <span className="font-semibold text-brown-700">{sowMeta.title}</span>.
              Verify hallucination controls, risk scores, and content accuracy before
              submitting for approval.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ───── Top Stats Row ───── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Confidence */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 flex items-center gap-4">
          <MetricRing value={92} size={64} strokeWidth={5} color="forest" />
          <div>
            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Overall Confidence
            </p>
            <p className="text-lg font-bold text-brown-900 mt-0.5">92%</p>
            <p className="text-[11px] text-forest-600 font-medium">Above threshold</p>
          </div>
        </div>

        {/* Risk Score */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 flex items-center gap-4">
          <MetricRing value={82} max={100} size={64} strokeWidth={5} color="forest" label="" />
          <div>
            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Risk Score
            </p>
            <p className="text-lg font-bold text-brown-900 mt-0.5">18/100</p>
            <Badge variant="forest" size="sm" dot>
              Low Risk
            </Badge>
          </div>
        </div>

        {/* Hallucination Flags */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200/80 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-gold-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Hallucination Flags
            </p>
            <p className="text-lg font-bold text-brown-900 mt-0.5">
              {unresolvedCount}
              <span className="text-sm font-normal text-beige-500 ml-1">
                / {hallucinationFlags.length}
              </span>
            </p>
            <p className="text-[11px] text-gold-600 font-medium">
              {unresolvedCount === 0 ? "All resolved" : "Needs review"}
            </p>
          </div>
        </div>

        {/* Completeness */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 flex items-center gap-4">
          <MetricRing value={96} size={64} strokeWidth={5} color="teal" />
          <div>
            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Completeness
            </p>
            <p className="text-lg font-bold text-brown-900 mt-0.5">96%</p>
            <p className="text-[11px] text-teal-600 font-medium">Near complete</p>
          </div>
        </div>
      </motion.div>

      {/* ───── Main Tabbed Content ───── */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="generated" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="generated" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Generated SOW
            </TabsTrigger>
            <TabsTrigger value="hallucination" className="gap-1.5">
              <ScanEye className="w-3.5 h-3.5" />
              Hallucination Analysis
              {unresolvedCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unresolvedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-1.5">
              <GitCompare className="w-3.5 h-3.5" />
              Comparison
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════════════
              TAB 1: Generated SOW
              ═══════════════════════════════════════════════════════ */}
          <TabsContent value="generated">
            <div className="space-y-4">
              {/* SOW metadata bar */}
              <div className="rounded-2xl border border-beige-200/50 bg-gradient-to-r from-white/80 to-beige-50/60 backdrop-blur-sm p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-100 to-beige-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-brown-500" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-brown-900">
                      {sowMeta.title}
                    </p>
                    <p className="text-[12px] text-beige-500">
                      {sowMeta.client} &middot; Generated{" "}
                      {new Date(sowMeta.generatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="teal" size="md" dot>
                    8 Sections
                  </Badge>
                  <Badge variant="forest" size="md">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </Badge>
                </div>
              </div>

              {/* Accordion sections */}
              <Accordion type="multiple" defaultValue={["sec-1", "sec-2"]} className="space-y-3">
                {generatedSections.map((section, idx) => {
                  const isLowConfidence = section.confidence < 85;
                  return (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className={cn(
                        "rounded-2xl border bg-white/70 backdrop-blur-sm overflow-hidden transition-all hover:shadow-md",
                        isLowConfidence
                          ? "border-gold-200/60"
                          : "border-beige-200/50"
                      )}
                    >
                      <AccordionTrigger className="px-5 py-4 hover:no-underline">
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold",
                              isLowConfidence
                                ? "bg-gold-100 text-gold-700"
                                : "bg-beige-100 text-beige-600"
                            )}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                          <span className="text-[14px] font-semibold text-brown-900 truncate">
                            {section.title}
                          </span>
                          <div className="flex items-center gap-2 ml-auto shrink-0">
                            {isLowConfidence && (
                              <AlertTriangle className="w-3.5 h-3.5 text-gold-500" />
                            )}
                            <Badge
                              variant={
                                section.confidence >= 90
                                  ? "forest"
                                  : section.confidence >= 85
                                  ? "teal"
                                  : "gold"
                              }
                              size="sm"
                            >
                              {section.confidence}%
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <p className="text-[13px] text-brown-700 leading-relaxed mb-4">
                          {section.content}
                        </p>

                        {/* Confidence bar */}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider w-20 shrink-0">
                            Confidence
                          </span>
                          <div className="flex-1">
                            <Progress
                              value={section.confidence}
                              size="sm"
                              variant={
                                section.confidence >= 90
                                  ? "gradient-forest"
                                  : section.confidence >= 85
                                  ? "teal"
                                  : "gold"
                              }
                            />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-brown-700 w-8 text-right">
                            {section.confidence}%
                          </span>
                        </div>

                        {/* Low-confidence warning callout */}
                        {isLowConfidence && (
                          <div className="mt-3 rounded-xl bg-gradient-to-r from-gold-50 to-beige-50 border border-gold-200/60 p-3.5">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shrink-0 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-gold-800 uppercase tracking-wider mb-0.5">
                                  Below Confidence Threshold
                                </p>
                                <p className="text-[12px] text-gold-700 leading-relaxed">
                                  This section scored below the 85% confidence threshold.
                                  Review the content carefully and verify against your
                                  original requirements before approving.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════
              TAB 2: Hallucination Analysis
              ═══════════════════════════════════════════════════════ */}
          <TabsContent value="hallucination">
            <div className="space-y-6">
              {/* Intro card */}
              <div className="rounded-2xl border border-teal-200/50 bg-gradient-to-br from-teal-50/60 via-white/80 to-beige-50/60 backdrop-blur-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-teal-200/40">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-brown-900 font-heading">
                      8-Layer Hallucination Prevention
                    </h2>
                    <p className="text-[13px] text-beige-600 mt-1 max-w-2xl leading-relaxed">
                      Every AI-generated SOW passes through 8 verification layers before
                      reaching you. This analysis shows the results of each layer,
                      flagged content, and recommended actions.
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-forest-500" />
                        <span className="text-[11px] font-semibold text-forest-700">
                          {hallucinationLayers.filter((l) => l.status === "passed").length} Passed
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gold-500" />
                        <span className="text-[11px] font-semibold text-gold-700">
                          {hallucinationLayers.filter((l) => l.status === "warning").length} Warnings
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-beige-400" />
                        <span className="text-[11px] font-semibold text-beige-600">
                          {hallucinationLayers.filter((l) => l.status === "pending").length} Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="text-[11px] font-semibold text-teal-700">
                          {hallucinationLayers.filter((l) => l.status === "active").length} Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification layers grid */}
              <div>
                <h3 className="text-[13px] font-bold text-beige-500 uppercase tracking-wider mb-3">
                  Verification Layers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hallucinationLayers.map((layer, idx) => {
                    const config = layerStatusConfig(layer.status);
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={layer.id}
                        variants={slideInRight}
                        className={cn(
                          "rounded-2xl border bg-white/70 backdrop-blur-sm p-5 transition-all hover:shadow-md",
                          layer.status === "warning"
                            ? "border-gold-200/60"
                            : "border-beige-200/50"
                        )}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Layer number + status icon */}
                          <div className="relative shrink-0">
                            <div
                              className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center ring-2",
                                config.bg,
                                config.ring
                              )}
                            >
                              <span className="text-[13px] font-bold text-brown-800">
                                L{idx + 1}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                                config.bg,
                                "ring-2 ring-white"
                              )}
                            >
                              <StatusIcon className={cn("w-3 h-3", config.iconColor)} />
                            </div>
                          </div>

                          {/* Layer info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-[13px] font-semibold text-brown-900 truncate">
                                {layer.name}
                              </h4>
                              <Badge variant={config.variant} size="sm" dot>
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-beige-500 mb-2">
                              {layer.description}
                            </p>
                            <p className="text-[12px] text-brown-700 leading-relaxed">
                              {layer.details}
                            </p>

                            {/* Score bar (not for pending) */}
                            {layer.status !== "pending" && (
                              <div className="flex items-center gap-2 mt-3">
                                <div className="flex-1">
                                  <Progress
                                    value={layer.score}
                                    size="sm"
                                    variant={
                                      layer.score >= 95
                                        ? "gradient-forest"
                                        : layer.score >= 85
                                        ? "teal"
                                        : "gold"
                                    }
                                  />
                                </div>
                                <span className="text-[11px] font-mono font-semibold text-brown-700 w-10 text-right">
                                  {layer.score}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Flagged Clauses Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-beige-500 uppercase tracking-wider">
                    Flagged Clauses
                    <span className="ml-2 text-[11px] font-normal text-beige-400 normal-case">
                      ({hallucinationFlags.length} flags, {unresolvedCount} unresolved)
                    </span>
                  </h3>
                  {unresolvedCount === 0 && (
                    <Badge variant="forest" size="sm" dot>
                      All Resolved
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  {hallucinationFlags.map((flag) => {
                    const sev = severityConfig(flag.severity);
                    const isResolved = resolvedFlags.has(flag.id);
                    return (
                      <div
                        key={flag.id}
                        className={cn(
                          "rounded-2xl border backdrop-blur-sm overflow-hidden transition-all",
                          isResolved
                            ? "border-beige-200/50 bg-beige-50/50 opacity-60"
                            : sev.border + " bg-white/70"
                        )}
                      >
                        {/* Severity strip */}
                        <div
                          className={cn(
                            "h-1 w-full",
                            flag.severity === "high"
                              ? "bg-gradient-to-r from-[var(--danger,#c44)] to-gold-500"
                              : flag.severity === "medium"
                              ? "bg-gradient-to-r from-gold-400 to-gold-500"
                              : "bg-gradient-to-r from-beige-300 to-beige-400"
                          )}
                        />

                        <div className="p-5">
                          {/* Flag header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center",
                                  sev.bg
                                )}
                              >
                                <Bug className={cn("w-4 h-4", sev.text)} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={sev.badge} size="sm">
                                    {sev.label} Severity
                                  </Badge>
                                  <span className="text-[11px] text-beige-500">
                                    in{" "}
                                    <span className="font-semibold text-brown-700">
                                      {flag.section}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            {isResolved && (
                              <Badge variant="forest" size="sm" dot>
                                Resolved
                              </Badge>
                            )}
                          </div>

                          {/* Flagged clause */}
                          <div className="rounded-xl bg-beige-50/80 border border-beige-200/50 p-3.5 mb-3">
                            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider mb-1">
                              Flagged Clause
                            </p>
                            <p className="text-[13px] text-brown-800 font-medium leading-relaxed italic">
                              &ldquo;{flag.clause}&rdquo;
                            </p>
                          </div>

                          {/* Reason */}
                          <div className="mb-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Search className="w-3 h-3 text-beige-400" />
                              <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
                                Why Flagged
                              </p>
                            </div>
                            <p className="text-[12px] text-brown-700 leading-relaxed">
                              {flag.reason}
                            </p>
                          </div>

                          {/* AI Suggestion */}
                          <div className="rounded-xl bg-gradient-to-r from-teal-50 to-beige-50 border border-teal-100/60 p-3.5 mb-4">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                                <Lightbulb className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-0.5">
                                  AI Recommendation
                                </p>
                                <p className="text-[12px] text-teal-700 leading-relaxed">
                                  {flag.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant={isResolved ? "outline" : "secondary"}
                              size="sm"
                              onClick={() => toggleResolve(flag.id)}
                            >
                              {isResolved ? (
                                <>
                                  <RefreshCcw className="w-3.5 h-3.5" />
                                  Unresolve
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Resolve
                                </>
                              )}
                            </Button>
                            {!isResolved && (
                              <Button variant="ghost" size="sm">
                                <X className="w-3.5 h-3.5" />
                                Dismiss
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overall hallucination prevention score */}
              <div className="rounded-2xl border border-beige-200/50 bg-gradient-to-br from-white/80 via-forest-50/20 to-teal-50/30 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-400 to-teal-500 flex items-center justify-center shadow-lg shadow-forest-200/30">
                      <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-beige-500 uppercase tracking-wider">
                        Hallucination Prevention Score
                      </p>
                      <p className="text-2xl font-bold text-brown-900 font-heading">
                        94.6
                        <span className="text-sm font-normal text-beige-500 ml-1">/ 100</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xl font-bold text-forest-700">6</p>
                      <p className="text-[10px] text-beige-500 font-medium">Layers Passed</p>
                    </div>
                    <div className="w-px h-8 bg-beige-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-gold-600">2</p>
                      <p className="text-[10px] text-beige-500 font-medium">Warnings</p>
                    </div>
                    <div className="w-px h-8 bg-beige-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-beige-500">1</p>
                      <p className="text-[10px] text-beige-500 font-medium">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════
              TAB 3: Risk Assessment
              ═══════════════════════════════════════════════════════ */}
          <TabsContent value="risk">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Breakdown */}
              <div className="lg:col-span-2 space-y-5">
                {/* Risk breakdown bars */}
                <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6">
                  <h3 className="text-[13px] font-bold text-beige-500 uppercase tracking-wider mb-5">
                    Risk Score Breakdown
                  </h3>
                  <div className="space-y-5">
                    {riskBreakdown.map((item) => {
                      const pct = Math.round((item.score / item.maxScore) * 100);
                      return (
                        <div key={item.category}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-brown-800">
                                {item.category}
                              </span>
                              <span className="text-[11px] text-beige-500">
                                (Weight: {item.weight}%)
                              </span>
                            </div>
                            <span className="text-[13px] font-mono font-bold text-brown-900">
                              {item.score}
                              <span className="text-beige-400">/{item.maxScore}</span>
                            </span>
                          </div>
                          <div className="relative">
                            <Progress
                              value={pct}
                              size="md"
                              variant={
                                pct >= 90
                                  ? "gradient-forest"
                                  : pct >= 75
                                  ? "teal"
                                  : "gold"
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-5 border-t border-beige-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-brown-900">
                        Total Risk Points Lost
                      </span>
                      <span className="text-[18px] font-mono font-bold text-brown-900">
                        {riskBreakdown.reduce(
                          (acc, r) => acc + (r.maxScore - r.score),
                          0
                        )}
                        <span className="text-sm text-beige-400 ml-1">/ 100</span>
                      </span>
                    </div>
                    <p className="text-[12px] text-beige-500 mt-1">
                      Risk score = total points deducted from a perfect 100.
                      Lower score = lower risk.
                    </p>
                  </div>
                </div>

                {/* Risk level scale */}
                <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6">
                  <h3 className="text-[13px] font-bold text-beige-500 uppercase tracking-wider mb-4">
                    Risk Level Scale
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        range: "0 - 30",
                        label: "Low Risk",
                        color: "bg-forest-500",
                        textColor: "text-forest-700",
                        description:
                          "AI output is well-supported by input data with minimal hallucination risk. Safe for approval with standard review.",
                        active: true,
                      },
                      {
                        range: "31 - 60",
                        label: "Medium Risk",
                        color: "bg-gold-500",
                        textColor: "text-gold-700",
                        description:
                          "Some AI inferences lack direct input support. Requires careful review of flagged sections before approval.",
                        active: false,
                      },
                      {
                        range: "61 - 100",
                        label: "High Risk",
                        color: "bg-[var(--danger,#c44)]",
                        textColor: "text-[var(--danger,#c44)]",
                        description:
                          "Significant hallucination risk detected. Not recommended for approval without substantial manual revision.",
                        active: false,
                      },
                    ].map((level) => (
                      <div
                        key={level.range}
                        className={cn(
                          "rounded-xl border p-4 flex items-start gap-3 transition-all",
                          level.active
                            ? "border-forest-200 bg-forest-50/40 ring-1 ring-forest-200"
                            : "border-beige-200/50 bg-beige-50/40"
                        )}
                      >
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full mt-0.5 shrink-0",
                            level.color
                          )}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={cn(
                                "text-[13px] font-bold",
                                level.textColor
                              )}
                            >
                              {level.label}
                            </span>
                            <span className="text-[11px] text-beige-500 font-mono">
                              ({level.range})
                            </span>
                            {level.active && (
                              <Badge variant="forest" size="sm">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-[12px] text-brown-700 leading-relaxed">
                            {level.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Overall risk card */}
              <div className="space-y-4">
                {/* Risk gauge card */}
                <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 text-center">
                  <h3 className="text-[12px] font-bold text-beige-500 uppercase tracking-wider mb-4">
                    Overall Risk Score
                  </h3>
                  <div className="flex justify-center mb-3">
                    <MetricRing
                      value={82}
                      max={100}
                      size={120}
                      strokeWidth={8}
                      color="forest"
                      label="Safe"
                    />
                  </div>
                  <p className="text-2xl font-bold text-brown-900 font-heading">
                    18
                    <span className="text-sm font-normal text-beige-500 ml-1">
                      / 100
                    </span>
                  </p>
                  <Badge variant="forest" size="md" dot className="mt-2">
                    Low Risk
                  </Badge>
                  <p className="text-[12px] text-beige-600 mt-3 leading-relaxed">
                    This SOW draft has a low risk score, indicating the AI
                    generation closely followed input parameters with minimal
                    hallucination.
                  </p>
                </div>

                {/* Quick risk factors */}
                <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6">
                  <h3 className="text-[12px] font-bold text-beige-500 uppercase tracking-wider mb-3">
                    Risk Factors
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: ShieldCheck,
                        label: "HIPAA Compliance",
                        value: "Verified",
                        color: "text-forest-600",
                        bg: "bg-forest-100",
                      },
                      {
                        icon: Lock,
                        label: "Data Encryption",
                        value: "AES-256",
                        color: "text-forest-600",
                        bg: "bg-forest-100",
                      },
                      {
                        icon: Scale,
                        label: "Budget Alignment",
                        value: "82% match",
                        color: "text-gold-600",
                        bg: "bg-gold-100",
                      },
                      {
                        icon: CalendarDays,
                        label: "Timeline Feasibility",
                        value: "Achievable",
                        color: "text-forest-600",
                        bg: "bg-forest-100",
                      },
                      {
                        icon: Users,
                        label: "Team Sizing",
                        value: "Optimal",
                        color: "text-teal-600",
                        bg: "bg-teal-100",
                      },
                    ].map((factor) => (
                      <div
                        key={factor.label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center",
                              factor.bg
                            )}
                          >
                            <factor.icon
                              className={cn("w-3.5 h-3.5", factor.color)}
                            />
                          </div>
                          <span className="text-[12px] text-beige-600">
                            {factor.label}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-[12px] font-semibold",
                            factor.color
                          )}
                        >
                          {factor.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry benchmark */}
                <div className="rounded-xl bg-gradient-to-br from-teal-50 to-beige-50 border border-teal-100/60 p-4">
                  <h4 className="text-[12px] font-bold text-teal-800 uppercase tracking-wider mb-1.5">
                    Industry Benchmark
                  </h4>
                  <p className="text-[12px] text-teal-700 leading-relaxed">
                    Healthcare SOWs average a risk score of 28/100. This draft
                    scores 36% better than the industry median, indicating strong
                    alignment with input requirements.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════
              TAB 4: Comparison
              ═══════════════════════════════════════════════════════ */}
          <TabsContent value="comparison">
            <div className="space-y-5">
              {/* Comparison intro */}
              <div className="rounded-2xl border border-beige-200/50 bg-gradient-to-r from-white/80 to-beige-50/60 backdrop-blur-sm p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-100 to-beige-100 flex items-center justify-center shrink-0">
                  <GitCompare className="w-5 h-5 text-brown-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-brown-900">
                    Input vs. Generated Comparison
                  </p>
                  <p className="text-[12px] text-beige-500">
                    Side-by-side view of your original parameters and what the AI
                    generated. Verify that generated content faithfully represents
                    your intent.
                  </p>
                </div>
              </div>

              {/* Comparison cards */}
              <div className="space-y-4">
                {comparisonSections.map((cmp) => {
                  const badge = matchBadge(cmp.match);
                  return (
                    <div
                      key={cmp.id}
                      className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden"
                    >
                      {/* Section label */}
                      <div className="px-5 py-3 bg-beige-50/60 border-b border-beige-200/50 flex items-center justify-between">
                        <h4 className="text-[13px] font-semibold text-brown-900">
                          {cmp.label}
                        </h4>
                        <Badge variant={badge.variant} size="sm" dot>
                          {badge.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-beige-200/50">
                        {/* Input */}
                        <div className="p-5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-5 h-5 rounded-md bg-beige-100 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-beige-500" />
                            </div>
                            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
                              Your Input
                            </p>
                          </div>
                          <p className="text-[13px] text-brown-700 leading-relaxed">
                            {cmp.input}
                          </p>
                        </div>

                        {/* Generated */}
                        <div className="p-5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-teal-500" />
                            </div>
                            <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                              AI Generated
                            </p>
                          </div>
                          <p className="text-[13px] text-brown-700 leading-relaxed">
                            {cmp.generated}
                          </p>
                        </div>
                      </div>

                      {/* Match indicator bar */}
                      {cmp.match === "expanded" && (
                        <div className="px-5 py-2.5 bg-teal-50/40 border-t border-teal-100/50 flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-teal-500" />
                          <p className="text-[11px] text-teal-700">
                            AI expanded this section with additional detail beyond
                            your input. Review to ensure accuracy.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Comparison summary */}
              <div className="rounded-2xl border border-beige-200/50 bg-gradient-to-br from-forest-50/30 to-white/80 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-brown-900">
                    Comparison Summary
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "High Match", count: 3, variant: "forest" as const },
                    { label: "AI Expanded", count: 1, variant: "teal" as const },
                    { label: "Partial Match", count: 0, variant: "gold" as const },
                    { label: "Low Match", count: 0, variant: "beige" as const },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center rounded-xl border border-beige-200/50 bg-white/60 p-3"
                    >
                      <p className="text-xl font-bold text-brown-900">
                        {stat.count}
                      </p>
                      <Badge variant={stat.variant} size="sm" className="mt-1">
                        {stat.label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ───── Request Changes Dialog ───── */}
      {showChangesDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-brown-950/40 backdrop-blur-sm"
            onClick={() => setShowChangesDialog(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-beige-200/60 bg-white/90 backdrop-blur-xl shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brown-900">Request Changes</h3>
                  <p className="text-xs text-beige-500">Provide feedback for the AI to revise the draft</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangesDialog(false)}
                className="w-8 h-8 rounded-lg hover:bg-beige-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-beige-500" />
              </button>
            </div>

            <Textarea
              placeholder="Describe the changes you'd like — e.g. 'Expand the security section to include HIPAA compliance details' or 'Reduce timeline estimates for Phase 2'..."
              value={changesFeedback}
              onChange={(e) => setChangesFeedback(e.target.value)}
              rows={5}
              className="resize-none"
            />

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowChangesDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gradient-primary"
                size="md"
                onClick={() => {
                  setShowChangesDialog(false);
                  setChangesFeedback("");
                }}
                disabled={!changesFeedback.trim()}
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ───── Reject & Re-generate Dialog ───── */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-brown-950/40 backdrop-blur-sm"
            onClick={() => setShowRejectDialog(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-beige-200/60 bg-white/90 backdrop-blur-xl shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brown-900">Reject & Re-generate</h3>
                <p className="text-xs text-beige-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-brown-700 leading-relaxed">
              Are you sure? This will <span className="font-semibold text-red-600">discard the current draft</span> and start a new AI generation. All review progress and annotations will be lost.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gradient-primary"
                size="md"
                className="!from-red-500 !to-red-600 hover:!from-red-600 hover:!to-red-700"
                onClick={() => {
                  setShowRejectDialog(false);
                  router.push("/enterprise/sow/generate");
                }}
              >
                <RefreshCcw className="w-4 h-4" />
                Confirm & Re-generate
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ───── Bottom Action Bar ───── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="border-t border-beige-200/60 bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowRejectDialog(true)}
              >
                <RefreshCcw className="w-4 h-4" />
                Reject & Re-generate
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowChangesDialog(true)}
              >
                <PenLine className="w-4 h-4" />
                Request Changes
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[11px] text-beige-500 max-w-xs text-right hidden md:block">
                Submitting will route to 4-stage approval:
                <span className="font-semibold text-brown-600">
                  {" "}Business &rarr; Legal &rarr; Security &rarr; Final
                </span>
              </p>
              <Button
                variant="gradient-primary"
                size="md"
                disabled={submitted}
                onClick={() => {
                  setSubmitted(true);
                  setTimeout(() => {
                    router.push("/enterprise/sow/sow-004/approve");
                  }, 1500);
                }}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submitted
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit for Approval
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
