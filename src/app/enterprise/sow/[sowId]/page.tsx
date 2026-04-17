"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  DollarSign,
  Clock,
  Tag,
  Layers,
  Shield,
  Users,
  GitBranch,
  History,
  ClipboardList,
  Link2,
  User,
  ExternalLink,
  Bot,
  Upload,
  AlertTriangle,
  ShieldCheck,
  Send,
  X,
  Search,
  Download,
  Scale,
  Eye,
  Gauge,
  Ban,
  Lock,
  Fingerprint,
  Filter,
  MessageSquareDiff,
  Undo2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useSowMessagesStore } from "@/lib/stores/sow-messages-store";
import { buildActivatedMessage, buildApprovedMessage, buildNextApproverMessage, buildChangesRequestedMessage } from "@/mocks/data/sow-approval-messages";
import { stagger, fadeUp, slideInRight } from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Progress,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { StatusTimeline } from "@/components/enterprise/status-timeline";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";
import { useSowStore, INITIAL_APPROVAL_STAGES } from "@/lib/stores/sow-store";
import { useSOWPipelineStore } from "@/lib/stores/sow-pipeline-store";
import { useConfirmAndSubmit, useManualSOW } from "@/lib/hooks/use-manual-sow";
import { useSow } from "@/lib/hooks/use-sow-wizard";
import { mockProjects } from "@/mocks/data/enterprise-projects";
import {
  mockSOWClauses,
  mockEthicsScreening,
  mockRegulatoryAlignment,
  mockGenerationParams,
  mockHallucinationLayers,
  sensitivityHandlingRequirements,
} from "@/mocks/data/enterprise-sow-detail";

/* ══════════════════════════════════════════════════════════════
   Shared config maps
   ══════════════════════════════════════════════════════════════ */

const statusVariantMap: Record<string, "beige" | "forest" | "teal" | "gold" | "brown"> = {
  draft: "beige",
  parsing: "teal",
  review: "teal",
  approval: "gold",
  approved: "forest",
  archived: "beige",
  rejected: "brown",
  changes_requested: "gold",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  parsing: "Parsing",
  review: "In Review",
  approval: "In Approval",
  approved: "Approved",
  archived: "Archived",
  rejected: "Rejected",
  changes_requested: "Changes Requested",
};

const confidentialityVariantMap: Record<string, "teal" | "beige" | "gold" | "brown"> = {
  public: "teal",
  internal: "beige",
  confidential: "gold",
  restricted: "brown",
};

const clauseTypeConfig: Record<string, { label: string; variant: "beige" | "forest" | "teal" | "gold" | "brown" }> = {
  dependency: { label: "Dependency", variant: "teal" },
  assumption: { label: "Assumption", variant: "beige" },
  constraint: { label: "Constraint", variant: "gold" },
  acceptance_criteria: { label: "Acceptance Criteria", variant: "forest" },
  ethical: { label: "Ethical", variant: "teal" },
  security: { label: "Security", variant: "brown" },
  ip: { label: "IP", variant: "gold" },
  liability: { label: "Liability", variant: "brown" },
  confidentiality: { label: "Confidentiality", variant: "beige" },
  sla: { label: "SLA", variant: "teal" },
  warranty: { label: "Warranty", variant: "forest" },
  termination: { label: "Termination", variant: "beige" },
};

function confidenceColor(c: number): "forest" | "teal" | "gold" {
  if (c >= 90) return "forest";
  if (c >= 75) return "teal";
  return "gold";
}

function confidenceVariant(c: number): "gradient-forest" | "teal" | "gold" {
  if (c >= 90) return "gradient-forest";
  if (c >= 75) return "teal";
  return "gold";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Mock generators ── */

function generateVersionHistory(sow: import("@/types/enterprise").SOW | undefined) {
  if (!sow) return [];
  const versions = [];
  for (let v = sow.version; v >= 1; v--) {
    const date = new Date(sow.createdAt);
    date.setDate(date.getDate() + (v - 1) * 5);
    versions.push({
      version: v,
      date: date.toISOString(),
      status: v === sow.version ? sow.status : "draft",
      changedBy: v === 1 ? sow.createdBy : sow.approvedBy || sow.createdBy,
      intakeMode: v === 1 ? sow.intakeMode : sow.intakeMode, // per B8: intake mode indicator per version
      changes:
        v === sow.version && sow.status === "approved"
          ? "Final approval and sign-off"
          : v === 1
          ? "Initial document upload"
          : `Revision ${v} -- updated scope and budget sections`,
    });
  }
  return versions;
}

type AuditEvent = {
  id: string;
  action: "created" | "updated" | "approved" | "submitted" | "parsed" | "reviewed";
  actor: string;
  timestamp: string;
  details: string;
};

function generateAuditTrail(sow: import("@/types/enterprise").SOW | undefined) {
  if (!sow) return [];
  const events: AuditEvent[] = [
    {
      id: "audit-1",
      action: "created",
      actor: sow.createdBy,
      timestamp: sow.createdAt,
      details: `SOW "${sow.title}" ${sow.intakeMode === "ai_generated" ? "generated via AI wizard" : "uploaded manually"}`,
    },
  ];
  if (sow.parsedSections > 0) {
    const parseDate = new Date(sow.createdAt);
    parseDate.setMinutes(parseDate.getMinutes() + 15);
    events.push({
      id: "audit-1b",
      action: "parsed",
      actor: "AI Engine",
      timestamp: parseDate.toISOString(),
      details: `AI extraction completed: ${sow.parsedSections} sections, ${mockSOWClauses.filter((c) => c.sowId === sow.id).length} clauses tagged`,
    });
  }
  if (sow.version > 1) {
    const editDate = new Date(sow.createdAt);
    editDate.setDate(editDate.getDate() + 3);
    events.push({
      id: "audit-2",
      action: "updated",
      actor: sow.createdBy,
      timestamp: editDate.toISOString(),
      details: "Scope sections revised based on AI suggestions",
    });
  }
  if (sow.status === "approval" || sow.status === "approved") {
    const submitDate = new Date(sow.createdAt);
    submitDate.setDate(submitDate.getDate() + 5);
    events.push({
      id: "audit-2b",
      action: "submitted",
      actor: sow.createdBy,
      timestamp: submitDate.toISOString(),
      details: "SOW submitted for multi-stage approval",
    });
  }
  if (sow.status === "approved" && sow.approvedBy) {
    events.push({
      id: "audit-3",
      action: "approved",
      actor: sow.approvedBy,
      timestamp: sow.updatedAt,
      details: "SOW approved and locked for decomposition",
    });
  }
  return events.reverse();
}

const auditActionConfig: Record<string, { color: string; bg: string }> = {
  created: { color: "text-teal-700", bg: "bg-teal-100" },
  updated: { color: "text-gold-700", bg: "bg-gold-100" },
  approved: { color: "text-forest-700", bg: "bg-forest-100" },
  submitted: { color: "text-brown-700", bg: "bg-brown-100" },
  parsed: { color: "text-teal-700", bg: "bg-teal-100" },
  reviewed: { color: "text-gold-700", bg: "bg-gold-100" },
};

const auditActionIcon: Record<string, React.ElementType> = {
  created: FileText,
  updated: ClipboardList,
  approved: CheckCircle2,
  submitted: Send,
  parsed: Bot,
  reviewed: Eye,
};

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */

export default function SOWDetailPage() {
  const params = useParams();
  const sowId = params.sowId as string;
  const allSows = useSowStore((s) => s.sows);
  const addSow = useSowStore((s) => s.addSow);
  const updateSow = useSowStore((s) => s.updateSow);
  const addPipelineSOW = useSOWPipelineStore((s) => s.addSOW);
  const updatePipelineSOW = useSOWPipelineStore((s) => s.updateSOW);
  const pipelineSows = useSOWPipelineStore((s) => s.sows);
  const { data: manualApiRes, isFetching: manualApiFetching } = useManualSOW(sowId);
  const { data: aiApiRes, isFetching: aiApiFetching } = useSow(sowId);
  const apiSowFetching = manualApiFetching || aiApiFetching;
  const confirmAndSubmit = useConfirmAndSubmit(sowId);

  /* Prefer whichever endpoint returned real data */
  const rawApiData = (manualApiRes?.data ?? aiApiRes?.data) as Record<string, unknown> | null | undefined;

  const normalizedApiSow = React.useMemo(() => {
    if (!rawApiData) return null;
    const d = { ...rawApiData } as Record<string, unknown>;
    /* Snake-case → camelCase aliases */
    if (d.approval_stages && !d.approvalStages) d.approvalStages = d.approval_stages;
    if (d.parsed_sections && !d.parsedSections) d.parsedSections = d.parsed_sections;
    if (d.total_sections && !d.totalSections) d.totalSections = d.total_sections;
    if (d.project_title && !d.title) d.title = d.project_title;
    if (d.client_organisation && !d.client) d.client = d.client_organisation;
    if (d.data_sensitivity && !d.dataSensitivity) d.dataSensitivity = d.data_sensitivity;
    if (d.estimated_budget && !d.estimatedBudget) d.estimatedBudget = d.estimated_budget;
    if (d.created_at && !d.createdAt) d.createdAt = d.created_at;
    if (d.updated_at && !d.updatedAt) d.updatedAt = d.updated_at;
    /* AI SOW: extract title from generated_content */
    if (!d.title && d.generated_content) {
      const gc = d.generated_content as Record<string, unknown>;
      if (gc.document_title) d.title = gc.document_title;
    }
    return d;
  }, [rawApiData]);
  const sow = React.useMemo(() => {
    // Try to find the SOW by its actual ID first
    const exactMatch = allSows.find((s) => s.id === sowId)
      ?? mockSOWs.find((s) => s.id === sowId);
    const pipelineMeta = pipelineSows.find((s) => s.id === sowId);

    if (exactMatch) {
      // Found in a real store — merge API data on top for real-time fields
      return normalizedApiSow ? { ...exactMatch, ...normalizedApiSow, id: sowId } : exactMatch;
    }

    // API-only SOW (no local store match) — build from API data directly
    if (normalizedApiSow) {
      const base = allSows[0] ?? {};
      return {
        ...base,
        ...normalizedApiSow,
        id: sowId,
        riskScore: { overall: 0, completeness: 0, confidence: 0, compliance: 0, patternMatch: 0 },
      };
    }

    // SOW only exists in the pipeline store (no mock/store entry).
    // Build a synthetic record from the pipeline metadata so the correct
    // approval stage is shown instead of whatever allSows[0] happens to have.
    if (pipelineMeta) {
      const stageKeys = ["business", "glimmora_commercial", "legal", "security", "final"] as const;
      const completed = pipelineMeta.completedStages;
      const current = pipelineMeta.currentStage;
      return {
        ...(allSows[0]),   // use as a shape template for fields like riskScore, pages, etc.
        id: sowId,
        title: pipelineMeta.title,
        client: pipelineMeta.client,
        status: "approval" as const,
        approvalStages: stageKeys.map((key, idx) => {
          const num = idx + 1;
          if (completed.includes(num)) return { stage: key, status: "approved" as const };
          if (num === current) return { stage: key, status: "in_review" as const, reviewer: "Enterprise Admin" };
          return { stage: key, status: "pending" as const };
        }),
      };
    }

    // Last resort fallback — only return if store has data
    return allSows.length > 0 ? allSows[0] : null;
  }, [allSows, pipelineSows, sowId, normalizedApiSow]);
  const linkedProject = sow ? mockProjects.find((p) => p.sowId === sow.id) : undefined;
  const sections = sow ? mockSOWSections.filter((s) => s.sowId === sow.id) : [];
  const clauses = sow ? mockSOWClauses.filter((c) => c.sowId === sow.id) : [];
  const versions = generateVersionHistory(sow);
  const auditTrail = generateAuditTrail(sow);
  const ethicsScreening = sow ? mockEthicsScreening[sow.id] || [] : [];
  const regulatoryItems = sow ? mockRegulatoryAlignment[sow.id] || [] : [];
  const genParams = sow ? mockGenerationParams[sow.id] : undefined;
  const hallucinationLayers = sow ? mockHallucinationLayers[sow.id] || [] : [];
  const sensitivityReqs = sow ? sensitivityHandlingRequirements[sow.dataSensitivity] || [] : [];

  /* UI state */
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    () => new Set(sections.slice(0, 3).map((s) => s.id))
  );
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [clauseTypeFilter, setClauseTypeFilter] = React.useState("all");
  const [clauseSearch, setClauseSearch] = React.useState("");
  const [auditTypeFilter, setAuditTypeFilter] = React.useState("all");
  const [docSearch, setDocSearch] = React.useState("");
  const [approvalChecked, setApprovalChecked] = React.useState<Record<string, boolean>>({});
  const [signatureText, setSignatureText] = React.useState("");
  const [activeApprovalIdx, setActiveApprovalIdx] = React.useState(0);
  const [showRequestChanges, setShowRequestChanges] = React.useState(false);
  const [requestChangesNote, setRequestChangesNote] = React.useState("");
  const [requestCategory, setRequestCategory] = React.useState<"scope"|"deliverables"|"timeline"|"other">("scope");
  const [requestSection, setRequestSection] = React.useState("Section 3 — Deliverables");
  const [sectionDropdownOpen, setSectionDropdownOpen] = React.useState(false);
  const sectionDropdownRef = React.useRef<HTMLDivElement>(null);
  const sectionTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [dropdownCoords, setDropdownCoords] = React.useState({ top: 0, left: 0, width: 0 });

  // Sync the active approval stage index to the first in_review stage whenever
  // the SOW changes (e.g. navigating from the pipeline page to a SOW at stage 3+).
  React.useEffect(() => {
    if (!sow) return;
    const stages = sow.approvalStages ?? [];
    const idx = stages.findIndex((s) => s.status === "in_review");
    if (idx >= 0) {
      setActiveApprovalIdx(idx);
    } else {
      const pendingIdx = stages.findIndex((s) => s.status === "pending");
      setActiveApprovalIdx(pendingIdx >= 0 ? pendingIdx : stages.length);
    }
    setApprovalChecked({});
  }, [sow?.id]);

  React.useEffect(() => {
    if (!sectionDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        sectionDropdownRef.current && !sectionDropdownRef.current.contains(e.target as Node) &&
        sectionTriggerRef.current && !sectionTriggerRef.current.contains(e.target as Node)
      ) {
        setSectionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sectionDropdownOpen]);

  const openSectionDropdown = () => {
    if (sectionTriggerRef.current) {
      const rect = sectionTriggerRef.current.getBoundingClientRect();
      setDropdownCoords({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 220) });
    }
    setSectionDropdownOpen(v => !v);
  };
  const pushNotification = useNotificationStore((s) => s.push);
  const addSowMessage = useSowMessagesStore((s) => s.addMessage);

  // Seed initial stage_activated message on first visit
  React.useEffect(() => {
    if (!sow) return;
    const thread = useSowMessagesStore.getState().getThread(sow.id);
    if (thread.length === 0) {
      const activatedMsg = buildActivatedMessage(sow.id, 0, sow.title);
      useSowMessagesStore.getState().addMessage(sow.id, activatedMsg);
      useNotificationStore.getState().push({
        title: activatedMsg.subject,
        body: activatedMsg.body,
        severity: "medium",
        href: `/enterprise/sow/${sow.id}`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sow?.id]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* SOW is ready for submission only if it's been parsed and has content */
  const isValidated = (sow?.parsedSections ?? 0) > 0 && (sow?.totalSections ?? 0) > 0;

  function handleConfirmSubmit() {
    if (confirmAndSubmit.isPending) return;

    const nowIso = new Date().toISOString();
    const patch = {
      status: "approval" as const,
      approvalStages: INITIAL_APPROVAL_STAGES,
      updatedAt: nowIso,
    };

    const upsertLocalSow = () => {
      const exists = allSows.some((s) => s.id === sow.id);
      if (exists) {
        updateSow(sow.id, patch);
      } else {
        addSow({ ...sow, ...patch });
      }
    };

    const upsertPipeline = () => {
      const exists = pipelineSows.some((s) => s.id === sow.id);
      const submittedDate = nowIso.split("T")[0];
      const totalValue = sow.estimatedBudget > 0 ? `$${sow.estimatedBudget.toLocaleString()}` : "$0";
      const stageApprover =
        sow.approvalStages?.find((s) => s.stage === "business")?.reviewer
        ?? sow.createdBy
        ?? "Enterprise Admin";

      const pipelinePayload = {
        id: sow.id,
        title: sow.title,
        client: sow.client,
        currentStage: 1,
        stageApprover,
        slaStatus: "on-track" as const,
        submittedDate,
        totalValue,
        completedStages: [],
        submittedBy: sow.createdBy,
      };

      if (exists) updatePipelineSOW(sow.id, pipelinePayload);
      else addPipelineSOW(pipelinePayload);
    };

    const finalizeSubmit = () => {
      upsertLocalSow();
      upsertPipeline();
      // Seed the first stage activation message
      const thread = useSowMessagesStore.getState().getThread(sow.id);
      if (thread.length === 0) {
        const activatedMsg = buildActivatedMessage(sow.id, 0, sow.title);
        useSowMessagesStore.getState().addMessage(sow.id, activatedMsg);
        useNotificationStore.getState().push({
          title: activatedMsg.subject,
          body: activatedMsg.body,
          severity: "medium",
          href: `/enterprise/sow/${sow.id}`,
        });
      }
      setSubmitSuccess(true);
      setTimeout(() => setShowSubmitModal(false), 2000);
    };

    if (normalizedApiSow) {
      confirmAndSubmit.mutate(
        { confirms_accuracy: true },
        {
          onSuccess: finalizeSubmit,
          onError: (err) => {
            const message = err instanceof Error ? err.message : "Unable to submit for approval.";
            toast.error("Submission failed", message);
          },
        }
      );
      return;
    }

    finalizeSubmit();
  }

  /* Filtered clauses */
  const filteredClauses = React.useMemo(() => {
    let list = [...clauses];
    if (clauseTypeFilter !== "all") list = list.filter((c) => c.type === clauseTypeFilter);
    if (clauseSearch.trim()) {
      const q = clauseSearch.toLowerCase();
      list = list.filter(
        (c) => c.text.toLowerCase().includes(q) || c.sectionRef.toLowerCase().includes(q)
      );
    }
    return list;
  }, [clauses, clauseTypeFilter, clauseSearch]);

  /* Prohibited clause count */
  const prohibitedCount = clauses.filter((c) => c.isProhibited).length;

  /* Clause type counts for filter */
  const clauseTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    clauses.forEach((c) => { counts[c.type] = (counts[c.type] || 0) + 1; });
    return counts;
  }, [clauses]);

  /* Filtered audit events */
  const filteredAudit = React.useMemo(() => {
    if (auditTypeFilter === "all") return auditTrail;
    return auditTrail.filter((e) => e.action === auditTypeFilter);
  }, [auditTrail, auditTypeFilter]);

  /* Document sections filtered by search */
  const filteredDocSections = React.useMemo(() => {
    if (!docSearch.trim()) return sections;
    const q = docSearch.toLowerCase();
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    );
  }, [sections, docSearch]);

  if (!sow) {
    if (apiSowFetching) {
      return (
        <div className="max-w-[1400px] mx-auto space-y-5">
          {/* Back link skeleton */}
          <div className="h-4 w-32 rounded animate-pulse" style={{ background: "var(--color-beige-100)" }} />
          {/* Header skeleton */}
          <div className="rounded-2xl border border-beige-100 bg-white/70 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-6 w-2/3 rounded animate-pulse" style={{ background: "var(--color-beige-100)" }} />
                <div className="h-4 w-1/3 rounded animate-pulse" style={{ background: "var(--color-beige-100)" }} />
              </div>
              <div className="h-9 w-28 rounded-xl animate-pulse" style={{ background: "var(--color-beige-100)" }} />
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-beige-100 p-4 space-y-2">
                  <div className="h-3 w-16 rounded animate-pulse" style={{ background: "var(--color-beige-100)" }} />
                  <div className="h-5 w-24 rounded animate-pulse" style={{ background: "var(--color-beige-100)" }} />
                </div>
              ))}
            </div>
          </div>
          {/* Content skeleton */}
          <div className="rounded-2xl border border-beige-100 bg-white/70 p-6 space-y-4">
            <div className="h-5 w-48 rounded animate-pulse" style={{ background: "var(--color-beige-100)" }} />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 rounded animate-pulse" style={{ background: "var(--color-beige-100)", width: `${70 + (i % 3) * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-beige-100 bg-beige-50/50 px-6 py-16 text-center">
        <p className="text-[14px] font-medium text-brown-600 mb-1">SOW not found</p>
        <p className="text-[12px] text-beige-400">This statement of work could not be loaded.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1400px] mx-auto space-y-5"
    >
      {/* ── Breadcrumb ── */}
      <motion.div variants={fadeUp}>
        <Link
          href="/enterprise/sow"
          className="inline-flex items-center gap-2 text-sm text-beige-600 hover:text-brown-700 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          SOW Repository
        </Link>
      </motion.div>

      {/* ── Header (B6 Step 1) ── */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm px-6 py-5"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Row 1: Title + status */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
                {sow.title}
              </h1>
              <Badge variant={statusVariantMap[sow.status]} size="md" dot>
                {statusLabel[sow.status]}
              </Badge>
            </div>
            {/* Row 2: Sub-metadata + secondary badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-beige-500">{sow.id.toUpperCase()}</span>
              <span className="w-1 h-1 rounded-full bg-beige-300" />
              <span className="text-[12px] text-beige-600">{sow.client}</span>
              <span className="w-1 h-1 rounded-full bg-beige-300" />
              <span className="text-[12px] text-beige-600">v{sow.version}</span>
              <span className="w-1 h-1 rounded-full bg-beige-300" />
              <span className="text-[12px] text-beige-600">{sow.fileSize}</span>
              <span className="w-1 h-1 rounded-full bg-beige-300" />
              <span className="text-[12px] text-beige-600">By {sow.createdBy}</span>
              <span className="w-1 h-1 rounded-full bg-beige-300" />
              <Badge
                variant={sow.intakeMode === "ai_generated" ? "teal" : "beige"}
                size="sm"
              >
                {sow.intakeMode === "ai_generated" ? (
                  <><Bot className="w-3 h-3" /> AI Generated</>
                ) : (
                  <><Upload className="w-3 h-3" /> Manual Upload</>
                )}
              </Badge>
              {sow.confidentiality && (
                <Badge variant={confidentialityVariantMap[sow.confidentiality]} size="sm">
                  <Shield className="w-3 h-3" />
                  {sow.confidentiality.charAt(0).toUpperCase() + sow.confidentiality.slice(1)}
                </Badge>
              )}
              {(sow.riskScore?.overall ?? 0) > 0 && (
                <Badge
                  variant={(sow.riskScore?.overall ?? 0) <= 25 ? "forest" : (sow.riskScore?.overall ?? 0) <= 50 ? "gold" : "brown"}
                  size="sm"
                >
                  Risk {sow.riskScore?.overall ?? 0}/100
                </Badge>
              )}
            </div>
          </div>

          {/* Status-aware header actions (B6 Step 1 a-e) */}
          <div className="flex items-center gap-2 shrink-0">
          {(sow.status === "draft" || sow.status === "review") && isValidated && (
            <Button variant="gradient-primary" size="sm" onClick={() => setShowSubmitModal(true)}>
              <Send className="w-3.5 h-3.5" />
              Submit for Approval
            </Button>
          )}
          {sow.status === "draft" && !isValidated && (
            <Link href={sow.intakeMode === "ai_generated" ? "/enterprise/sow/generate" : "/enterprise/sow/upload"}>
              <Button variant="outline" size="sm">
                <Sparkles className="w-3.5 h-3.5" />
                Continue Setup
              </Button>
            </Link>
          )}
          {sow.status === "approval" && (
            <Link href={`/enterprise/sow/${sow.id}/approve`}>
              <Button variant="outline" size="sm">
                <Clock className="w-3.5 h-3.5" />
                View Approval Progress
              </Button>
            </Link>
          )}
          {sow.status === "approved" && sow.planId && (
            <Link href={`/enterprise/decomposition/${sow.planId}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5" />
                View Plan
              </Button>
            </Link>
          )}
          {sow.status === "approved" && !sow.planId && (
            <Link href={`/enterprise/decomposition?sowId=${sow.id}`}>
              <Button variant="gradient-primary" size="sm">
                <Layers className="w-3.5 h-3.5" />
                Start Decomposition
              </Button>
            </Link>
          )}
          </div>
        </div>
      </motion.div>

      {/* ── Top Metadata Strip ── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: BookOpen, label: "Pages", value: `${sow.pages ?? 0}` },
            { icon: Layers, label: "Sections", value: `${sow.parsedSections ?? 0}/${sow.totalSections ?? 0}` },
            { icon: DollarSign, label: "Est. Budget", value: (sow.estimatedBudget ?? 0) > 0 ? `$${((sow.estimatedBudget ?? 0) / 1000).toFixed(0)}K` : "TBD" },
            { icon: Clock, label: "Duration", value: sow.estimatedDuration ?? "TBD" },
            { icon: Users, label: "Stakeholders", value: `${(sow.stakeholders ?? []).length}` },
            { icon: Calendar, label: "Updated", value: formatDate(sow.updatedAt ?? new Date().toISOString()) },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={label} className={cn("flex items-center gap-3", i > 0 && "lg:border-l lg:border-beige-200/50 lg:pl-4")}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-beige-50 to-beige-100 border border-beige-200/50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brown-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-beige-400 uppercase tracking-widest">{label}</p>
                <p className="text-[15px] font-bold text-brown-900 truncate leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
         APPROVAL STATUS
         ══════════════════════════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-beige-100 bg-beige-50/50 overflow-hidden">
        <div className="w-full">

          {/* ═══════════════════════════════════════════════════
             Approval Status
             ═══════════════════════════════════════════════════ */}
          <div>
            {(() => {
              const STAGE_META: Record<string, { name: string; role: string }> = {
                business:            { name: "Business Owner Review",        role: "Enterprise Admin" },
                glimmora_commercial: { name: "GlimmoraTeam Commercial Review", role: "GlimmoraTeam Admin" },
                legal:               { name: "Legal / Compliance Review",    role: "Enterprise Admin" },
                security:            { name: "Security Review",              role: "Enterprise Admin" },
                final:               { name: "Final Sign-off",               role: "Enterprise Admin" },
              };
              const STAGE_CHECKLISTS: Record<string, string[]> = {
                business: [
                  "Scope aligns with stated business objectives",
                  "Budget range is within my authorisation limit",
                  "Timeline is realistic for the project scope",
                  "Deliverables are clearly defined",
                  "Stakeholders correctly identified",
                ],
                glimmora_commercial: [
                  "Commercial terms are acceptable",
                  "Pricing model is validated",
                  "Revenue recognition clauses reviewed",
                  "Client credit check completed",
                  "Contract template approved",
                ],
                legal: [
                  "IP ownership clauses are compliant",
                  "Liability caps are within policy",
                  "Data processing agreement reviewed",
                  "Dispute resolution terms accepted",
                  "Governing law confirmed",
                ],
                security: [
                  "Data classification requirements met",
                  "Security controls are documented",
                  "Penetration testing scope defined",
                  "Access control policy aligned",
                  "Incident response plan referenced",
                ],
                final: [
                  "All prior stages approved",
                  "Executive sign-off obtained",
                  "SOW filed in document repository",
                  "Client countersignature received",
                  "Kick-off meeting scheduled",
                ],
              };

              const approvalStages  = sow.approvalStages ?? [];
              const totalStages     = approvalStages.length;
              const isDone         = activeApprovalIdx >= totalStages;
              const activeStageIdx = isDone ? totalStages - 1 : activeApprovalIdx;
              const activeStage    = approvalStages[activeApprovalIdx];
              const activeMeta     = !isDone && activeStage ? STAGE_META[activeStage.stage] : null;
              const checklist      = !isDone && activeStage ? (STAGE_CHECKLISTS[activeStage.stage] ?? []) : [];
              const allChecked     = checklist.every((_, i) => approvalChecked[`${activeApprovalIdx}-${i}`]);

              const handleApprove = () => {
                const stageName = activeMeta?.name ?? "Stage";
                toast.success(`Stage ${activeApprovalIdx + 1} Approved`, `${stageName} has been approved successfully.`);
                addSowMessage(sow.id, buildApprovedMessage(sow.id, activeApprovalIdx, sow.title, sow.createdBy));
                pushNotification({
                  title: `Stage ${activeApprovalIdx + 1} Approved — ${stageName}`,
                  body: `"${sow.title}" has moved to the next approval stage.`,
                  severity: "medium",
                  href: `/enterprise/sow/${sow.id}`,
                });
                const nextMsg = buildNextApproverMessage(sow.id, activeApprovalIdx + 1, sow.title);
                if (nextMsg) {
                  addSowMessage(sow.id, nextMsg);
                  pushNotification({
                    title: nextMsg.subject,
                    body: nextMsg.body,
                    severity: "medium",
                    href: `/enterprise/sow/${sow.id}`,
                  });
                }
                setApprovalChecked({});
                setSignatureText("");
                setShowRequestChanges(false);
                setRequestChangesNote("");
                setActiveApprovalIdx(prev => prev + 1);
              };

              const PRE_FILLED_NOTES: Record<number, string> = {
                0: "Please revisit the scope definition — deliverables in Section 3 are too broad and need measurable acceptance criteria before I can approve.",
                1: "The commercial terms need revision. The payment schedule doesn't align with milestone completion. Please adjust the invoicing structure.",
                2: "Legal review requires additional clarity on IP ownership clauses and data processing agreement references.",
                3: "Security controls documentation is incomplete. Please provide evidence of penetration testing scope and access control policies.",
                4: "Final sign-off pending resolution of all prior stage comments. Please resubmit after addressing feedback.",
              };

              const handleSubmitRequestChanges = () => {
                const stageName = activeMeta?.name ?? `Stage ${activeApprovalIdx + 1}`;
                const noteText = requestChangesNote || PRE_FILLED_NOTES[activeApprovalIdx] || "Please review and address the feedback.";

                // Push into global notification bell
                pushNotification({
                  title: `Changes Requested — ${stageName}`,
                  body: noteText,
                  severity: "high",
                  href: `/enterprise/sow/${sow.id}`,
                });

                // Play notification sound
                try {
                  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const playTone = (freq: number, start: number, dur: number, gain: number) => {
                    const osc = ctx.createOscillator();
                    const g   = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                    g.gain.setValueAtTime(0, ctx.currentTime + start);
                    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                    osc.connect(g);
                    g.connect(ctx.destination);
                    osc.start(ctx.currentTime + start);
                    osc.stop(ctx.currentTime + start + dur);
                  };
                  playTone(880, 0,    0.18, 0.18);
                  playTone(660, 0.18, 0.22, 0.14);
                  playTone(440, 0.38, 0.30, 0.10);
                } catch (_) {}

                toast.warning(`Changes Requested — Stage ${activeApprovalIdx + 1}`, noteText);
                addSowMessage(sow.id, buildChangesRequestedMessage(sow.id, activeApprovalIdx, sow.title, sow.createdBy, noteText, requestSection));

                // Update SOW status in repository store
                updateSow(sow.id, { status: "changes_requested" });

                // Flag in pipeline store so it surfaces at the top with notification
                updatePipelineSOW(sow.id, {
                  changesRequested: true,
                  changeRequestReason: noteText,
                  changeRequestedAt: new Date().toISOString(),
                  changeRequestedBy: stageName,
                });

                setShowRequestChanges(false);
              };

              return (
                <div className="space-y-0">
                  {/* ── Banner ── */}
                  {!isDone && activeMeta && (
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-teal-50 border-b border-teal-100">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <p className="text-[13px] text-teal-800">
                        {activeMeta.name} — waiting for:{" "}
                        <span className="font-bold">Enterprise Admin</span>
                      </p>
                    </div>
                  )}
                  {isDone && (
                    <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-forest-50 border-b border-forest-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                        <p className="text-[13px] text-forest-800 font-medium">All stages approved — SOW is fully signed off.</p>
                      </div>
                      <Link
                        href={sow.planId ? `/enterprise/decomposition/${sow.planId}` : `/enterprise/decomposition?sowId=${sow.id}`}
                        className="flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#2A6068,#1D4A50)", boxShadow: "0 2px 8px rgba(42,96,104,0.30)" }}
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        {sow.planId ? "View Plan" : "Start Decomposition"}
                      </Link>
                    </div>
                  )}

                  {/* ── Horizontal stepper ── */}
                  <div className="px-6 pt-6 pb-5 border-b border-beige-100">
                    <div className="relative flex items-start justify-between">
                      {/* connecting line behind circles */}
                      <div className="absolute top-5 left-0 right-0 h-px bg-beige-200 z-0" />
                      {(sow.approvalStages ?? []).map((stage, idx) => {
                        const isApproved = idx < activeApprovalIdx;
                        const isActive   = idx === activeApprovalIdx && !isDone;
                        const isRejected = false;
                        const meta       = STAGE_META[stage.stage] ?? { name: stage.stage, role: "" };
                        return (
                          <div key={stage.stage} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                            <div className={cn(
                              "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white shrink-0 transition-all",
                              isApproved ? "bg-teal-500 border-teal-500 shadow-md shadow-teal-100" :
                              isActive   ? "border-brown-400 ring-4 ring-brown-100 shadow-sm" :
                              isRejected ? "bg-brown-500 border-brown-500" :
                              "border-beige-300"
                            )}>
                              {isApproved
                                ? <CheckCircle2 className="w-5 h-5 text-white" />
                                : isRejected
                                ? <X className="w-4 h-4 text-white" />
                                : <span className={cn("text-[13px] font-bold",
                                    isActive ? "text-brown-600" : "text-beige-400"
                                  )}>{idx + 1}</span>
                              }
                            </div>
                            <div className="text-center px-1">
                              <p className={cn("text-[11px] font-semibold leading-tight",
                                isApproved ? "text-teal-700" : isActive ? "text-brown-800" : isRejected ? "text-brown-600" : "text-gray-600"
                              )}>{meta.name}</p>
                              <p className={cn("text-[10px] mt-0.5",
                                isApproved ? "text-teal-500" : isActive ? "text-teal-600" : "text-beige-400"
                              )}>{meta.role}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Checklist ── */}
                  {!isDone && activeStage && checklist.length > 0 && (
                    <div className="px-6 py-5 border-b border-beige-100">
                      <p className="text-[10px] font-bold text-beige-500 uppercase tracking-widest mb-4">
                        Stage {activeApprovalIdx + 1} Review Checklist
                      </p>
                      <div className="space-y-3">
                        {checklist.map((item, i) => {
                          const key = `${activeApprovalIdx}-${i}`;
                          const checked = !!approvalChecked[key];
                          return (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                              <button
                                type="button"
                                onClick={() => setApprovalChecked(prev => ({ ...prev, [key]: !checked }))}
                                className="w-[18px] h-[18px] rounded-[5px] shrink-0 flex items-center justify-center transition-all duration-150"
                                style={checked ? {
                                  background: "linear-gradient(135deg,#2A6068,#1D4A50)",
                                  border: "none",
                                  boxShadow: "0 2px 6px rgba(42,96,104,0.35)",
                                } : {
                                  background: "#fff",
                                  border: "1.5px solid #D1D5DB",
                                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
                                }}
                                onMouseEnter={e => { if (!checked) e.currentTarget.style.borderColor = "#2A6068"; }}
                                onMouseLeave={e => { if (!checked) e.currentTarget.style.borderColor = "#D1D5DB"; }}
                              >
                                {checked && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                  >
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </button>
                              <span className={cn("text-[12.5px] transition-colors", checked ? "text-gray-400" : "text-gray-700")}>
                                {item}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Digital Signature ── */}
                  {!isDone && activeStage && (
                    <div className="px-6 py-3.5 border-b border-beige-100">
                      <p className="text-[9px] font-bold text-beige-500 uppercase tracking-widest mb-1">
                        Digital Signature
                      </p>
                      <p className="text-[11px] text-gray-400 mb-2">
                        Type your full name to sign — constitutes formal approval of Stage {activeApprovalIdx + 1}.
                      </p>
                      <input
                        type="text"
                        value={signatureText}
                        onChange={e => setSignatureText(e.target.value)}
                        placeholder="Your full name"
                        className="w-64 border border-beige-200 rounded-lg px-3 py-1.5 text-[12px] text-gray-800 italic font-medium bg-beige-50/50 focus:outline-none focus:border-brown-400 focus:ring-2 focus:ring-brown-100 transition-all"
                      />
                    </div>
                  )}

                  {/* ── Request Changes panel ── */}
                  <AnimatePresence>
                  {showRequestChanges && !isDone && activeStage && (() => {
                    const SECTIONS = ["Section 1 — Business Context", "Section 2 — Delivery Scope", "Section 3 — Deliverables", "Section 4 — Timeline", "Section 5 — Budget"];
                    const MAX = 500;
                    const pct = Math.min((requestChangesNote.length / MAX) * 100, 100);
                    return (
                      <motion.div
                        key="request-changes"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="overflow-hidden border-b border-beige-100"
                      >
                      <div className="bg-white px-5 py-3" style={{ overflow: "visible" }}>
                        {/* constrained width card */}
                        <div className="max-w-sm">

                          {/* ── Header ── */}
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "linear-gradient(135deg,#A67763,#8B5E4A)", boxShadow: "0 2px 8px rgba(166,119,99,0.3)" }}>
                                <MessageSquareDiff className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div>
                                <p className="text-[12.5px] font-bold text-gray-800 leading-none">Request changes</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{activeMeta?.name}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-brown-700 border border-brown-200 bg-brown-50 rounded-full px-2.5 py-0.5">
                              Stage {activeApprovalIdx + 1}
                            </span>
                          </div>

                          {/* ── Textarea ── */}
                          <textarea
                            rows={4}
                            maxLength={MAX}
                            value={requestChangesNote}
                            onChange={e => setRequestChangesNote(e.target.value)}
                            className="w-full rounded-xl px-3 py-2.5 text-[12px] text-gray-700 leading-relaxed resize-none focus:outline-none transition-all border border-gray-200 bg-white"
                            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                            onFocus={e => { e.currentTarget.style.borderColor = "rgba(166,119,99,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(166,119,99,0.1)"; }}
                            onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                          />

                          {/* ── Section dropdown + char count ── */}
                          <div className="flex items-center justify-between mt-2 mb-3">

                            {/* Custom dropdown — portal to escape overflow:hidden parents */}
                            <div className="relative">
                              <button
                                ref={sectionTriggerRef}
                                type="button"
                                onClick={openSectionDropdown}
                                className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-700 transition-all"
                                style={{
                                  border: "1px solid rgba(166,119,99,0.3)",
                                  background: "linear-gradient(to bottom, #FFFAF7, #FFF3EC)",
                                  boxShadow: "0 1px 4px rgba(166,119,99,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                                  minWidth: 180,
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#A67763" }} />
                                <span className="flex-1 text-left truncate">{requestSection}</span>
                                <motion.span animate={{ rotate: sectionDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                  <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "#A67763" }} />
                                </motion.span>
                              </button>

                              {typeof document !== "undefined" && createPortal(
                                <AnimatePresence>
                                  {sectionDropdownOpen && (
                                    <motion.div
                                      ref={sectionDropdownRef}
                                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                      transition={{ duration: 0.15, ease: "easeOut" }}
                                      style={{
                                        position: "fixed",
                                        top: dropdownCoords.top,
                                        left: dropdownCoords.left,
                                        width: dropdownCoords.width,
                                        zIndex: 9999,
                                        background: "#fff",
                                        border: "1px solid rgba(166,119,99,0.2)",
                                        borderRadius: 12,
                                        overflow: "hidden",
                                        boxShadow: "0 8px 28px rgba(166,119,99,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                                      }}
                                    >
                                      {SECTIONS.map((s, idx) => {
                                        const isSelected = s === requestSection;
                                        return (
                                          <button
                                            key={s}
                                            type="button"
                                            onClick={() => { setRequestSection(s); setSectionDropdownOpen(false); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[11.5px] transition-all"
                                            style={{
                                              background: isSelected ? "linear-gradient(to right,#FFF3EC,#FFF8F4)" : "transparent",
                                              color: isSelected ? "#8B5E4A" : "#4B5563",
                                              fontWeight: isSelected ? 600 : 400,
                                              borderBottom: idx < SECTIONS.length - 1 ? "1px solid rgba(166,119,99,0.08)" : "none",
                                            }}
                                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#FAFAFA"; }}
                                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? "linear-gradient(to right,#FFF3EC,#FFF8F4)" : "transparent"; }}
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isSelected ? "#A67763" : "#D1D5DB" }} />
                                            {s}
                                            {isSelected && <CheckCircle2 className="w-3 h-3 ml-auto shrink-0" style={{ color: "#A67763" }} />}
                                          </button>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>,
                                document.body
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-300"
                                  style={{ width: `${pct}%`, background: pct > 80 ? "linear-gradient(to right,#A67763,#8B5E4A)" : "linear-gradient(to right,#2A6068,#1D4A50)" }} />
                              </div>
                              <span className="text-[10px] text-gray-400 tabular-nums">{requestChangesNote.length}/{MAX}</span>
                            </div>
                          </div>

                          {/* ── Footer actions ── */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                                <Fingerprint className="w-3 h-3" />
                              </button>
                              <button className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                                <Clock className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setShowRequestChanges(false)}
                                className="px-3 py-1.5 rounded-lg text-[11.5px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                              >Cancel</button>
                              <button
                                onClick={handleSubmitRequestChanges}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11.5px] font-bold text-white transition-all"
                                style={{ background: "linear-gradient(135deg,#A67763,#8B5E4A)", boxShadow: "0 2px 8px rgba(166,119,99,0.35)" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(166,119,99,0.5)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(166,119,99,0.35)"; }}
                              >
                                <Send className="w-3 h-3" /> Send feedback
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>{/* end overflow-visible inner */}
                      </motion.div>
                    );
                  })()}
                  </AnimatePresence>

                  {/* ── Action buttons ── */}
                  {!isDone && activeStage && (
                    <div className="px-6 py-4 flex items-center gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={!allChecked || !signatureText.trim()}
                        className={cn(
                          "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all",
                          allChecked && signatureText.trim()
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-200"
                            : "bg-gray-300 cursor-not-allowed"
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Stage {activeApprovalIdx + 1}
                      </button>
                      <button
                        onClick={() => {
                          setShowRequestChanges(v => !v);
                          setRequestChangesNote(PRE_FILLED_NOTES[activeApprovalIdx] ?? "");
                          setRequestCategory("scope");
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
                        style={{ background: "linear-gradient(135deg, #A67763, #8B5E4A)", boxShadow: "0 3px 10px rgba(166,119,99,0.35)" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 5px 16px rgba(166,119,99,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 3px 10px rgba(166,119,99,0.35)"; e.currentTarget.style.transform = ""; }}
                      >
                        <Undo2 className="w-4 h-4" />
                        Request Changes
                      </button>
                    </div>
                  )}

                  {/* Submit for Approval (pre-pipeline) */}
                  {(sow.status === "draft" || sow.status === "review") && isValidated && (
                    <div className="px-6 py-4">
                      <Button variant="gradient-primary" size="sm" onClick={() => setShowSubmitModal(true)}>
                        <Send className="w-3.5 h-3.5" /> Submit for Approval
                      </Button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>{/* end approval */}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
         SUBMISSION CONFIRMATION MODAL (B7 Step 1)
         ═══════════════════════════════════════════════════ */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-brown-950/30 backdrop-blur-sm"
            onClick={() => !submitSuccess && setShowSubmitModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg mx-4 rounded-2xl border border-beige-200/60 bg-white/95 backdrop-blur-xl shadow-2xl shadow-brown-900/10 p-6"
          >
            {!submitSuccess ? (
              <>
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-100 to-beige-100 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-brown-600" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-brown-900">Submit SOW for Approval?</h3>
                    <p className="text-[13px] text-beige-600 mt-0.5">
                      This will send the SOW through the 4-stage approval pipeline.
                    </p>
                  </div>
                </div>

                {/* SOW Summary */}
                <div className="rounded-xl bg-beige-50/80 border border-beige-200/50 p-4 mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-beige-500 uppercase">Title</span>
                    <span className="text-[13px] font-medium text-brown-800">{sow.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-beige-500 uppercase">Risk Score</span>
                    <span className={cn(
                      "text-[13px] font-mono font-bold",
                      sow.riskScore.overall <= 25 ? "text-forest-600" : sow.riskScore.overall <= 50 ? "text-gold-600" : "text-brown-700"
                    )}>
                      {sow.riskScore.overall}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-beige-500 uppercase">Completeness</span>
                    <span className="text-[13px] font-medium text-brown-800">
                      {sow.gapAnalysisScore ? `${sow.gapAnalysisScore}%` : `${sow.parsedSections}/${sow.totalSections} sections`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-beige-500 uppercase">Sensitivity</span>
                    <Badge variant={confidentialityVariantMap[sow.confidentiality]} size="sm">
                      {sow.confidentiality.charAt(0).toUpperCase() + sow.confidentiality.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-beige-500 uppercase">Est. Timeline</span>
                    <span className="text-[13px] font-medium text-brown-800">{sow.estimatedDuration}</span>
                  </div>
                </div>

                {/* Approval Stages Preview */}
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider mb-2">Approval Stages</p>
                  <div className="flex items-center gap-2">
                    {["Business", "Legal", "Security", "Final"].map((stage, idx) => (
                      <React.Fragment key={stage}>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-beige-100/80 border border-beige-200/50">
                          <span className="w-4 h-4 rounded-full bg-beige-200 flex items-center justify-center text-[9px] font-bold text-beige-600">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] font-medium text-brown-700">{stage}</span>
                        </div>
                        {idx < 3 && <div className="w-4 h-px bg-beige-300" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
                  <Button
                    variant="gradient-primary"
                    size="sm"
                    onClick={handleConfirmSubmit}
                    disabled={confirmAndSubmit.isPending}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {confirmAndSubmit.isPending ? "Submitting..." : "Confirm Submission"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 text-forest-600" />
                </div>
                <h3 className="text-[16px] font-bold text-brown-900 mb-1">SOW Submitted Successfully</h3>
                <p className="text-[13px] text-beige-600">
                  The SOW has been sent to Stage 1: Business Owner Review.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
