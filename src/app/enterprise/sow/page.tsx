"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText, Search, Plus, DollarSign, Shield, Upload, Sparkles, AlertTriangle,
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Clock,
  MoreVertical, Eye, Download, Archive, CheckCircle2, X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";
import { useSowStore } from "@/lib/stores/sow-store";
import { useManualSOWList, useDeleteManualSOW } from "@/lib/hooks/use-manual-sow";
import { useSowList } from "@/lib/hooks/use-sow-wizard";

/* ══════════════════════════════════════════ Status config (per FSD §7.1.4) ══════════════════════════════════════════ */

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft:                      { label: "Draft",                    color: "var(--color-gray-600)",   bg: "var(--color-gray-100)" },
  review:                     { label: "In Review",                color: "var(--color-teal-700)",   bg: "var(--color-teal-50)" },
  approval:                   { label: "In Review",                color: "var(--color-teal-700)",   bg: "var(--color-teal-50)" },
  pending_commercial_review:  { label: "Pending Commercial Review", color: "var(--color-gold-700)",  bg: "var(--color-gold-50)" },
  approved:                   { label: "Approved",                 color: "var(--color-forest-700)", bg: "var(--color-forest-50)" },
  rejected:                   { label: "Rejected",                 color: "var(--danger)",           bg: "var(--danger-light)" },
  changes_requested:          { label: "Changes Requested",        color: "var(--color-gold-700)",   bg: "var(--color-gold-50)" },
  archived:                   { label: "Archived",                 color: "var(--color-gray-500)",   bg: "var(--color-gray-100)" },
};

const sensitivityConfig: Record<string, { label: string; color: string; bg: string }> = {
  public:       { label: "Public",       color: "var(--color-teal-700)",   bg: "var(--color-teal-50)" },
  internal:     { label: "Internal",     color: "var(--color-gray-600)",   bg: "var(--color-gray-100)" },
  confidential: { label: "Confidential", color: "var(--color-gold-700)",   bg: "var(--color-gold-50)" },
  restricted:   { label: "Restricted",   color: "var(--danger)",           bg: "var(--danger-light)" },
};

/* FSD §7.1.4: Risk bar colors — green 0–25, amber 26–50, orange-red 51–75, red 76–100 */
function riskBarColor(score: number): string {
  if (score <= 25) return "var(--color-forest-500)";
  if (score <= 50) return "var(--color-gold-500)";
  if (score <= 75) return "#e67e22";
  return "var(--danger)";
}
function riskScoreColor(score: number): string {
  if (score <= 25) return "var(--color-forest-700)";
  if (score <= 50) return "var(--color-gold-700)";
  if (score <= 75) return "#c0570a";
  return "var(--danger)";
}

/* FSD §7.1.4: DD Mon YYYY format */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

type SortField = "title" | "client" | "intake" | "status" | "sensitivity" | "risk" | "version" | "modified";
type SortDir = "asc" | "desc";

/* FSD §7.1.3: STATUS filter options */
const statusFilterOptions = [
  { value: "all",       label: "STATUS: ALL" },
  { value: "draft",     label: "Draft" },
  { value: "in_review", label: "In Review" },
  { value: "pending_commercial_review", label: "Pending Commercial Review" },
  { value: "approved",  label: "Approved" },
  { value: "rejected",  label: "Rejected" },
  { value: "archived",  label: "Archived" },
];

/* FSD §7.1.3: INTAKE filter options */
const intakeFilterOptions = [
  { value: "all",          label: "INTAKE: ALL" },
  { value: "ai_generated", label: "AI-Generated" },
  { value: "manual_upload", label: "Manual Upload" },
];

/* FSD §7.1.3: RISK filter options */
const riskFilterOptions = [
  { value: "all",      label: "RISK: ALL" },
  { value: "low",      label: "Low (0–25)" },
  { value: "medium",   label: "Medium (26–50)" },
  { value: "high",     label: "High (51–75)" },
  { value: "critical", label: "Critical (76–100)" },
];

/* ══════════════════════════════════════════ Pill helper ══════════════════════════════════════════ */

function Pill({ bg, color, children, bold, className }: { bg: string; color: string; children: React.ReactNode; bold?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[9px] tracking-wide uppercase px-2.5 py-0.5 rounded-full", bold ? "font-bold" : "font-medium", className)}
      style={{ background: bg, color }}>
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════ Risk Bar (FSD §7.1.4) ══════════════════════════════════════════ */

function RiskBar({ score }: { score: number }) {
  if (score <= 0) return <span className="text-[11px] text-gray-300">—</span>;
  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(score, 100)}%`, background: riskBarColor(score) }} />
      </div>
      <span className="font-mono text-[11px] font-semibold" style={{ color: riskScoreColor(score), minWidth: 20, textAlign: "right" }}>
        {score}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════ Row Kebab Menu (FSD §7.1.5) ══════════════════════════════════════════ */

function RowKebab({ sow, onAction }: { sow: typeof mockSOWs[0]; onAction: (action: string, sowId: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items: { label: string; action: string; show: boolean }[] = [
    { label: "View Detail",            action: "view",     show: true },
    { label: "Edit",                   action: "edit",     show: sow.status === "draft" },
    { label: "Download PDF",           action: "download", show: true },
    { label: "View Approval Progress", action: "approval", show: ["approval", "review", "pending_commercial_review"].includes(sow.status) },
    { label: "Archive",                action: "archive",  show: ["approved", "rejected"].includes(sow.status) },
  ];

  return (
    <div ref={ref} className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all">
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-52 rounded-xl bg-white py-1.5 border border-beige-200/60"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          {items.filter((i) => i.show).map((item) => (
            <button key={item.action} onClick={(e) => { e.stopPropagation(); onAction(item.action, sow.id); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-[12px] text-brown-700 hover:bg-beige-50 transition-colors text-left">
              {item.action === "view" && <Eye className="w-3.5 h-3.5" />}
              {item.action === "edit" && <FileText className="w-3.5 h-3.5" />}
              {item.action === "download" && <Download className="w-3.5 h-3.5" />}
              {item.action === "approval" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {item.action === "archive" && <Archive className="w-3.5 h-3.5" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════ Recently Viewed Panel (FSD §7.1.3) ══════════════════════════════════════════ */

function RecentlyViewedPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  /* Mock recent items — last 10 accessed, sorted by access time */
  const recentItems = mockSOWs.slice(0, 5).map((s, i) => ({
    id: s.id, title: s.title, client: s.client, status: s.status,
    timeAgo: ["2h ago", "5h ago", "1d ago", "2d ago", "3d ago"][i],
  }));

  if (!open) return null;
  return (
    <div ref={ref} className="absolute right-0 top-10 z-50 w-80 rounded-xl bg-white border border-beige-200/60"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-hair)" }}>
        <span className="text-[12px] font-semibold text-brown-800">Recently Viewed</span>
      </div>
      <div className="max-h-[320px] overflow-y-auto">
        {recentItems.map((item) => {
          const sc = statusConfig[item.status] || statusConfig.draft;
          return (
            <Link key={item.id} href={`/enterprise/sow/${item.id}`}>
              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-beige-50/60 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-brown-900 truncate">{item.title}</div>
                  <div className="text-[10px] text-beige-400 mt-0.5">{item.client}</div>
                </div>
                <Pill bg={sc.bg} color={sc.color}>{sc.label}</Pill>
                <span className="text-[10px] text-beige-400 shrink-0">{item.timeAgo}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ SOW REPOSITORY PAGE (FSD §7.1) ══════════════════════════════════════════ */

export default function SOWListPage() {
  const router = useRouter();

  /* Filters — FSD §7.1.3 */
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [intakeFilter, setIntakeFilter] = React.useState("all");
  const [riskFilter, setRiskFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [recentViewedOpen, setRecentViewedOpen] = React.useState(false);

  const storeSows = useSowStore((s) => s.sows);
  const { data: manualSowListRes, isFetching: manualFetching, isLoading: manualLoading } = useManualSOWList();
  const { data: aiSowListRes, isFetching: aiFetching, isLoading: aiLoading } = useSowList();
  const isFetchingAny = manualFetching || aiFetching;
  const isLoading = manualLoading || aiLoading;
  const deleteSow = useDeleteManualSOW();

  /* Normalise raw API responses into the shape the table expects */
  function extractList(res: unknown): Record<string, unknown>[] {
    if (!res) return [];
    const r = res as Record<string, unknown>;
    if (Array.isArray(r)) return r as Record<string, unknown>[];
    if (Array.isArray(r.data)) return r.data as Record<string, unknown>[];
    const d = (r.data ?? r) as Record<string, unknown>;
    for (const k of ["sows", "items", "results", "documents", "list"]) {
      if (Array.isArray(d[k])) return d[k] as Record<string, unknown>[];
    }
    return [];
  }

  function normaliseToSOW(item: Record<string, unknown>, mode: "ai_generated" | "manual_upload") {
    const updatedAt = String(item.updated_at ?? item.updatedAt ?? item.created_at ?? item.createdAt ?? new Date().toISOString());
    const gc = mode === "ai_generated" ? ((item.generated_content ?? {}) as Record<string, unknown>) : {};

    /* Title */
    const title = String(gc.document_title ?? item.title ?? item.project_title ?? item.document_title ?? "Untitled SOW");

    /* Client — AI SOWs store client in business_owner_approver_id as "Name, Company" */
    let client = String(item.client ?? item.client_organisation ?? item.clientOrganisation ?? gc.client_name ?? gc.client ?? "");
    if (!client && mode === "ai_generated") {
      const bizOwner = String(item.business_owner_approver_id ?? "");
      if (bizOwner.includes(", ")) client = bizOwner.split(", ").pop()?.trim() ?? "";
    }

    /* Risk score — check quality_metrics first (AI SOWs), then risk_score/riskScore */
    const qm = (item.quality_metrics ?? item.qualityMetrics ?? {}) as Record<string, unknown>;
    const riskRaw = item.risk_score ?? item.riskScore ?? qm.risk_score ?? qm.riskScore;
    let riskOverall = 0;
    if (typeof riskRaw === "number") {
      riskOverall = riskRaw;
    } else if (riskRaw && typeof riskRaw === "object") {
      riskOverall = Number((riskRaw as Record<string, unknown>).overall ?? 0);
    } else if (mode === "ai_generated") {
      const conf = Number(qm.overall_confidence ?? item.confidence_score ?? item.confidenceScore ?? 0);
      riskOverall = conf > 0 ? Math.round(100 - conf) : 0;
    }

    return {
      id:               String(item.id ?? item._id ?? item.sow_id ?? item.wizard_id ?? ""),
      title,
      client,
      status:           String(item.status ?? "draft"),
      intakeMode:       mode,
      dataSensitivity:  String(item.data_sensitivity ?? item.dataSensitivity ?? "internal"),
      riskScore:        { overall: riskOverall, completeness: 0, confidence: 0, compliance: 0, patternMatch: 0 },
      version:          Number(item.version ?? 1),
      updatedAt,
      createdAt:        String(item.created_at ?? item.createdAt ?? updatedAt),
      estimatedBudget:  Number(item.estimated_budget ?? item.estimatedBudget ?? 0),
      createdBy:        String(item.created_by ?? item.createdBy ?? ""),
      approvedBy:       String(item.approved_by ?? item.approvedBy ?? ""),
      approvalStages:   (item.approval_stages ?? item.approvalStages ?? []) as import("@/types/enterprise").SOWApprovalStage[],
      parsedSections:   Number(item.parsed_sections ?? item.parsedSections ?? 0),
      totalSections:    Number(item.total_sections ?? item.totalSections ?? 0),
      pages:            Number(item.pages ?? 0),
    } as import("@/types/enterprise").SOW;
  }

  const manualSows = extractList(manualSowListRes).map((item) => normaliseToSOW(item, "manual_upload"));
  const aiSows = extractList(aiSowListRes).map((item) => normaliseToSOW(item, "ai_generated"));

  /* Merge AI + manual SOWs from API; fall back to Zustand store if no API */
  const apiCombined = [...aiSows, ...manualSows];
  const allSows = apiCombined.length > 0 ? apiCombined : storeSows;


  const [sortField, setSortField] = React.useState<SortField>("modified");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  /* ⌘K / Ctrl+K keyboard shortcut for search — FSD §7.1.3 */
  const searchRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  /* Filter + Sort logic — FSD §7.1.3 (AND logic, real-time) */
  const filtered = React.useMemo(() => {
    let list = [...allSows];
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "draft": list = list.filter((s) => s.status === "draft"); break;
        case "in_review": list = list.filter((s) => ["review", "approval"].includes(s.status)); break;
        case "pending_commercial_review": list = list.filter((s) => s.status === "pending_commercial_review"); break;
        case "approved": list = list.filter((s) => s.status === "approved"); break;
        case "rejected": list = list.filter((s) => s.status === "rejected"); break;
        case "archived": list = list.filter((s) => s.status === "archived"); break;
      }
    }

    /* INTAKE filter */
    if (intakeFilter !== "all") list = list.filter((s) => s.intakeMode === intakeFilter);

    /* RISK filter */
    if (riskFilter !== "all") {
      switch (riskFilter) {
        case "low":      list = list.filter((s) => (s.riskScore?.overall ?? 0) >= 0 && (s.riskScore?.overall ?? 0) <= 25); break;
        case "medium":   list = list.filter((s) => (s.riskScore?.overall ?? 0) >= 26 && (s.riskScore?.overall ?? 0) <= 50); break;
        case "high":     list = list.filter((s) => (s.riskScore?.overall ?? 0) >= 51 && (s.riskScore?.overall ?? 0) <= 75); break;
        case "critical": list = list.filter((s) => (s.riskScore?.overall ?? 0) >= 76 && (s.riskScore?.overall ?? 0) <= 100); break;
      }
    }

    /* Search — FSD §7.1.3: min 3 chars, searches title, client, ID */
    if (search.trim().length >= 3) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) || s.client.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      );
    }

    /* Sort — FSD §7.1.4: default sort Modified descending */
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title": cmp = a.title.localeCompare(b.title); break;
        case "client": cmp = a.client.localeCompare(b.client); break;
        case "intake": cmp = a.intakeMode.localeCompare(b.intakeMode); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "sensitivity": cmp = (a.dataSensitivity || "").localeCompare(b.dataSensitivity || ""); break;
        case "risk": cmp = (a.riskScore?.overall ?? 0) - (b.riskScore?.overall ?? 0); break;
        case "version": cmp = a.version - b.version; break;
        case "modified": cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [allSows, statusFilter, intakeFilter, riskFilter, search, sortField, sortDir]);

  React.useEffect(() => { setCurrentPage(1); }, [statusFilter, intakeFilter, riskFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilterCount = [statusFilter, intakeFilter, riskFilter].filter((v) => v !== "all").length;

  function clearAllFilters() { setStatusFilter("all"); setIntakeFilter("all"); setRiskFilter("all"); setSearch(""); }

  const totalSOWs = allSows.length;
  const pendingCount = allSows.filter((s) => ["approval", "review", "changes_requested"].includes(s.status)).length;
  const approvedCount = allSows.filter((s) => s.status === "approved").length;
  const scoredSOWs = allSows.filter((s) => (s.riskScore?.overall ?? 0) > 0);
  const avgRisk = scoredSOWs.length > 0 ? Math.round(scoredSOWs.reduce((sum, s) => sum + (s.riskScore?.overall ?? 0), 0) / scoredSOWs.length) : 0;
  const totalBudget = allSows.filter((s) => s.status === "approved").reduce((sum, s) => sum + (s.estimatedBudget ?? 0), 0);

  /* Tile click handlers — FSD §7.1.2 */
  function handleTileClick(tile: string) {
    switch (tile) {
      case "total": clearAllFilters(); break;
      case "pending": clearAllFilters(); setStatusFilter("in_review"); break;
      case "approved": clearAllFilters(); setStatusFilter("approved"); break;
      case "risk": clearAllFilters(); setSortField("risk"); setSortDir("desc"); break;
      case "budget": router.push("/enterprise/billing"); break;
    }
  }

  /* Row action handler — FSD §7.1.5 */
  function handleRowAction(action: string, sowId: string) {
    switch (action) {
      case "view": router.push(`/enterprise/sow/${sowId}`); break;
      case "edit": router.push(`/enterprise/sow/${sowId}`); break;
      case "download": break; /* PDF download */
      case "approval": router.push(`/enterprise/sow/${sowId}`); break;
      case "archive":
        deleteSow.mutate(sowId);
        break;
    }
  }

  const columns = [
    { field: "title" as SortField, label: "Project Title", align: "left", minW: 240 },
    { field: "client" as SortField, label: "Client", align: "left", minW: 120 },
    { field: "intake" as SortField, label: "Intake", align: "left", minW: 130 },
    { field: "status" as SortField, label: "Status", align: "left", minW: 130 },
    { field: "sensitivity" as SortField, label: "Sensitivity", align: "left", minW: 100 },
    { field: "risk" as SortField, label: "Risk", align: "center", minW: 110 },
    { field: "version" as SortField, label: "Version", align: "center", minW: 70 },
    { field: "modified" as SortField, label: "Modified ↓", align: "left", minW: 100 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Hero skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-beige-100 animate-pulse shrink-0" />
            <div className="space-y-2 mt-1">
              <div className="h-5 w-44 rounded-lg bg-beige-100 animate-pulse" />
              <div className="h-3.5 w-72 rounded bg-beige-100 animate-pulse" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-xl bg-beige-100 animate-pulse" />
        </div>

        {/* KPI tiles skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-beige-100 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-10 rounded bg-beige-100 animate-pulse" />
                <div className="h-2.5 w-20 rounded bg-beige-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Table card skeleton */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <div className="h-4 w-48 rounded bg-beige-100 animate-pulse" />
          </div>
          {/* Filter bar */}
          <div className="flex items-center justify-between gap-3 px-6 py-3" style={{ borderBottom: "1px solid var(--border-hair)" }}>
            <div className="h-8 w-60 rounded-xl bg-beige-100 animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-32 rounded-xl bg-beige-100 animate-pulse" />
              <div className="h-8 w-28 rounded-xl bg-beige-100 animate-pulse" />
              <div className="h-8 w-24 rounded-xl bg-beige-100 animate-pulse" />
              <div className="h-8 w-8 rounded-xl bg-beige-100 animate-pulse" />
            </div>
          </div>
          {/* Table header */}
          <div className="h-9 bg-beige-50/60 animate-pulse" style={{ borderBottom: "1px solid var(--border-hair)" }} />
          {/* Table rows */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5" style={{ borderBottom: "1px solid var(--border-hair)" }}>
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-2/3 rounded bg-beige-100 animate-pulse" />
              </div>
              <div className="h-3 w-24 rounded bg-beige-100 animate-pulse" />
              <div className="h-5 w-20 rounded-full bg-beige-100 animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-beige-100 animate-pulse" />
              <div className="h-3 w-16 rounded bg-beige-100 animate-pulse" />
              <div className="flex items-center gap-1.5 justify-center">
                <div className="h-1.5 w-14 rounded-full bg-beige-100 animate-pulse" />
                <div className="h-3 w-6 rounded bg-beige-100 animate-pulse" />
              </div>
              <div className="h-3 w-8 rounded bg-beige-100 animate-pulse" />
              <div className="h-3 w-16 rounded bg-beige-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HERO ═══ */}
      <motion.div variants={fadeUp} className="mb-7">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brown-500 to-brown-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brown-200/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">SOW Repository</h1>
              <p className="text-[13px] text-beige-500 mt-0.5">
                Manage all Statements of Work — upload, track, and approve across projects.
              </p>
            </div>
          </div>
          <Link href="/enterprise/sow/intake">
            <button className="flex items-center gap-1.5 rounded-xl text-white text-xs font-semibold px-4 py-2.5 shrink-0 transition-all hover:-translate-y-0.5 bg-gradient-to-r from-brown-500 to-brown-700 hover:from-brown-600 hover:to-brown-800"
              style={{ boxShadow: "0 2px 8px color-mix(in srgb, var(--color-brown-500) 30%, transparent)" }}>
              <Plus className="w-3 h-3" /> New SOW
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ═══ KPI TILES — FSD §7.1.2 ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-7">
        {[
          { key: "total",    label: "Total SOWs",    value: String(totalSOWs), icon: FileText,       iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { key: "pending",  label: "Pending Action", value: String(pendingCount), icon: AlertTriangle, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
          { key: "approved", label: "Approved",       value: String(approvedCount), icon: Shield,       iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
          { key: "risk",     label: "Avg Risk Score", value: String(avgRisk),  icon: AlertTriangle,  iconBg: "bg-gradient-to-br from-brown-500 to-brown-700" },
          { key: "budget",   label: "Total Budget",   value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          /* FSD §7.1.2: Avg Risk color — green ≤25, amber 26–50, red >50 */
          const riskTextColor = kpi.key === "risk" && avgRisk > 0
            ? (avgRisk <= 25 ? "var(--color-forest-700)" : avgRisk <= 50 ? "var(--color-gold-700)" : "var(--danger)")
            : undefined;
          return (
            <motion.button key={kpi.key} variants={scaleIn}
              className="rounded-2xl border bg-white/70 backdrop-blur-sm p-4 flex items-center gap-4 text-left transition-all cursor-pointer hover:border-beige-300/60 hover:shadow-sm border-beige-200/50"
              onClick={() => handleTileClick(kpi.key)}>
              <div className={`w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                <KpiIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[22px] font-bold text-brown-900 tracking-tight leading-none" style={{ color: riskTextColor || undefined }}>
                  {kpi.value}
                </p>
                <p className="text-[10px] text-beige-500 mt-0.5 font-medium uppercase tracking-wide">{kpi.label}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ═══ TABLE CARD ═══ */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden mb-5">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-[14px] font-semibold text-brown-900">All Statements of Work</span>
          </div>

          {/* ═══ FILTER BAR — FSD §7.1.3 ═══ */}
          <div className="flex items-center justify-between gap-3 px-6 py-3" style={{ borderBottom: "1px solid var(--border-hair)" }}>
            {/* Search — FSD §7.1.3: "Search SOWs by title, client, or ID..." + ⌘K */}
            <div className={cn("flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 bg-white/80 backdrop-blur-sm", searchFocused ? "w-64" : "w-[240px]")}
              style={{
                border: searchFocused ? "1px solid var(--color-brown-300)" : "1px solid rgba(222,207,196,0.6)",
                padding: "7px 12px",
                boxShadow: searchFocused ? "0 0 0 3px color-mix(in srgb, var(--color-brown-500) 8%, transparent)" : undefined,
              }}
            >
              <Search className="w-3.5 h-3.5 shrink-0 text-beige-400" />
              <input ref={searchRef} type="text" placeholder="Search SOWs by title, client, or ID..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                className="border-none outline-none bg-transparent w-full text-[12.5px] text-brown-800 placeholder:text-beige-400" />
              {search ? (
                <button onClick={() => setSearch("")} className="shrink-0 p-0.5 rounded text-beige-400 hover:text-brown-600"><X className="w-3 h-3" /></button>
              ) : !searchFocused ? (
                <kbd className="font-mono whitespace-nowrap shrink-0 text-[9px] text-beige-400 bg-beige-100 border border-beige-200 px-1.5 py-px rounded">⌘K</kbd>
              ) : null}
            </div>

            {/* Filters + Recently Viewed — FSD §7.1.3 */}
            <div className="flex items-center gap-2">
              {/* STATUS filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 rounded-xl bg-white/80 border border-beige-200/60 px-3 text-[12px] text-brown-700 hover:border-beige-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 130 }}><SelectValue placeholder="STATUS: ALL" /></SelectTrigger>
                <SelectContent>{statusFilterOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
              {/* INTAKE filter */}
              <Select value={intakeFilter} onValueChange={setIntakeFilter}>
                <SelectTrigger className="h-8 rounded-xl bg-white/80 border border-beige-200/60 px-3 text-[12px] text-brown-700 hover:border-beige-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 120 }}><SelectValue placeholder="INTAKE: ALL" /></SelectTrigger>
                <SelectContent>{intakeFilterOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
              {/* RISK filter */}
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-8 rounded-xl bg-white/80 border border-beige-200/60 px-3 text-[12px] text-brown-700 hover:border-beige-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 110 }}><SelectValue placeholder="RISK: ALL" /></SelectTrigger>
                <SelectContent>{riskFilterOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="flex items-center gap-1.5 text-[11px] font-medium text-teal-600 hover:text-teal-700 px-2.5 py-1 rounded-xl hover:bg-teal-50 transition-all underline underline-offset-2">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}

              {/* Clock icon — Recently Viewed (FSD §7.1.3) */}
              <div className="relative">
                <button onClick={() => setRecentViewedOpen(!recentViewedOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-xl text-beige-400 hover:text-brown-600 hover:bg-beige-50 border border-beige-200/60 transition-all">
                  <Clock className="w-3.5 h-3.5" />
                </button>
                <RecentlyViewedPanel open={recentViewedOpen} onClose={() => setRecentViewedOpen(false)} />
              </div>
            </div>
          </div>

          {/* ═══ TABLE — FSD §7.1.4 ═══ */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <colgroup>
                <col style={{ minWidth: 300 }} />
                <col style={{ width: 140 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 120 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 52 }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-hair)" }}>
                  {columns.map((col) => {
                    const active = sortField === col.field;
                    return (
                      <th key={col.field} onClick={() => handleSort(col.field)}
                        className="cursor-pointer select-none transition-colors"
                        style={{
                          padding: "11px 16px", textAlign: col.align as "left" | "center",
                          fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                          color: active ? "var(--color-brown-700)" : "var(--color-beige-500)",
                          background: "rgba(249,247,245,0.6)",
                        }}>
                        <div className="flex items-center gap-1" style={{ justifyContent: col.align === "center" ? "center" : "flex-start" }}>
                          <span>{col.label}</span>
                          <span style={{ opacity: active ? 1 : 0, transition: "opacity 0.15s" }}>
                            {active && sortDir === "asc" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  {/* Actions column */}
                  <th style={{ padding: "11px 12px", background: "rgba(249,247,245,0.6)" }} />
                </tr>
              </thead>
              <tbody>
                {/* Skeleton rows — show when fetching and no data yet */}
                {isFetchingAny && paginated.length === 0 && Array.from({ length: 7 }).map((_, i) => (
                  <tr key={`sk-${i}`} style={{ borderBottom: "1px solid var(--border-hair)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="animate-pulse rounded" style={{ height: 13, width: "75%", background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="animate-pulse rounded" style={{ height: 12, width: "65%", background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="animate-pulse rounded-full" style={{ height: 20, width: 90, background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="animate-pulse rounded-full" style={{ height: 20, width: 90, background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="animate-pulse rounded" style={{ height: 12, width: "60%", background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="animate-pulse rounded-full" style={{ height: 6, width: 56, background: "var(--color-beige-100)" }} />
                        <div className="animate-pulse rounded" style={{ height: 12, width: 20, background: "var(--color-beige-100)" }} />
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <div className="animate-pulse rounded mx-auto" style={{ height: 12, width: 24, background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div className="animate-pulse rounded" style={{ height: 12, width: "70%", background: "var(--color-beige-100)" }} />
                    </td>
                    <td style={{ padding: "8px 12px" }} />
                  </tr>
                ))}
                {/* Empty state — not fetching, no data */}
                {!isFetchingAny && paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: "40px 16px", textAlign: "center" }}>
                      <span className="text-[13px] text-beige-400">No statements of work found.</span>
                    </td>
                  </tr>
                )}
                {/* Data rows */}
                {paginated.map((sow) => {
                  const sc = statusConfig[sow.status] || statusConfig.draft;
                  const sens = sensitivityConfig[sow.dataSensitivity] || sensitivityConfig.internal;
                  /* FSD §7.1.4: Pending Commercial Review uses amber-orange, bold */
                  const isPendingCommercial = sow.status === "pending_commercial_review";
                  return (
                    <tr key={sow.id} onClick={() => router.push(`/enterprise/sow/${sow.id}`)}
                      className="group cursor-pointer transition-colors hover:bg-beige-50/40"
                      style={{ borderBottom: "1px solid var(--border-hair)" }}>

                      {/* Project Title */}
                      <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                        <div className="text-[13px] font-semibold text-brown-900 group-hover:text-teal-700 transition-colors">{sow.title}</div>
                      </td>

                      {/* Client */}
                      <td className="text-[12.5px] text-brown-700" style={{ padding: "13px 16px", verticalAlign: "middle" }}>{sow.client}</td>

                      {/* Intake — FSD §7.1.4: Sparkle + "AI-GENERATED" or Upload arrow + "MANUAL UPLOAD" */}
                      <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                        <Pill bg={sow.intakeMode === "ai_generated" ? "var(--color-teal-50)" : "var(--color-gray-100)"}
                              color={sow.intakeMode === "ai_generated" ? "var(--color-teal-700)" : "var(--color-gray-600)"}>
                          {sow.intakeMode === "ai_generated"
                            ? <><Sparkles className="w-2.5 h-2.5" /> AI-Generated</>
                            : <><Upload className="w-2.5 h-2.5" /> Manual Upload</>}
                        </Pill>
                      </td>

                      {/* Status — FSD §7.1.4 */}
                      <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                        <Pill bg={sc.bg} color={sc.color} bold={isPendingCommercial}>{sc.label}</Pill>
                      </td>

                      {/* Sensitivity */}
                      <td className="text-[12px] text-brown-700" style={{ padding: "13px 16px", verticalAlign: "middle" }}>{sens.label}</td>

                      {/* Risk — FSD §7.1.4: Coloured progress bar + numeric score */}
                      <td style={{ padding: "13px 16px", verticalAlign: "middle", textAlign: "center" }}>
                        <RiskBar score={sow.riskScore?.overall ?? 0} />
                      </td>

                      {/* Version */}
                      <td style={{ padding: "13px 16px", verticalAlign: "middle", textAlign: "center" }}>
                        <span className="font-mono text-[12px] font-medium text-brown-600">v{sow.version}</span>
                      </td>

                      {/* Modified */}
                      <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                        <span className="text-[11.5px] text-beige-500">{formatDate(sow.updatedAt)}</span>
                      </td>

                      {/* Kebab menu — FSD §7.1.5 */}
                      <td style={{ padding: "8px 12px", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                        <RowKebab sow={sow} onAction={handleRowAction} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>

          {/* Pagination */}
          {totalPages > 1 && <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid var(--border-hair)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-beige-400">Rows per page</span>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="h-7 w-auto rounded-xl bg-white/80 border border-beige-200/60 px-2.5 text-[11px] text-brown-700 hover:border-beige-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 52 }}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-beige-400">
                {filtered.length > 0 ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}` : "0 results"}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}
                  className="flex items-center justify-center w-7 h-7 rounded-xl text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                  className="flex items-center justify-center w-7 h-7 rounded-xl text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>}

        </motion.div>
    </motion.div>
  );
}
