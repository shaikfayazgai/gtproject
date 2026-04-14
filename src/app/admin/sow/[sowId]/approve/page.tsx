"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertTriangle, ChevronLeft, ChevronDown, ChevronUp,
  DollarSign, Target, Scale, Shield, ShieldCheck, Clock, XCircle,
  Send, Sparkles, Building2, FileText, Users, Tag, Calendar,
  BookOpen, Layers, Bot, Lock, Gauge, LayoutGrid, GitBranch,
  MessageSquare, CornerDownRight, CircleDot, Paperclip, File, ImageIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Checkbox, Textarea } from "@/components/ui";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";

/* ─── Config ─────────────────────────────────────────────────── */

const STAGE_LABELS: Record<string, string> = {
  business:            "Business Owner",
  glimmora_commercial: "GlimmoraTeam Commercial",
  legal:               "Legal / Compliance",
  security:            "Security Review",
  final:               "Final Sign-off",
};

const STAGE_DESC: Record<string, string> = {
  business:            "Budget, scope & business alignment",
  glimmora_commercial: "Rate cards, budget viability & commercial terms",
  legal:               "Contractual terms & compliance review",
  security:            "Data sensitivity & security requirements",
  final:               "Executive sign-off for project initiation",
};

const STAGE_ICONS: Record<string, LucideIcon> = {
  business: DollarSign, glimmora_commercial: Target,
  legal: Scale, security: Shield, final: ShieldCheck,
};

const COMMERCIAL_CHECKLIST = [
  { id: "rate-card",        label: "Rate card alignment verified",       description: "All declared roles have configured rate cards" },
  { id: "margin-ok",        label: "Margin & fee structure approved",    description: "Budget viability vs scope confirmed" },
  { id: "resource-avail",   label: "Resource availability confirmed",    description: "Contributor matching feasible for declared skills" },
  { id: "commercial-terms", label: "Commercial terms standard-compliant", description: "Pricing model and payment schedule supported" },
];

const TABS = [
  { id: "overview",  label: "Overview",  icon: LayoutGrid },
  { id: "sections",  label: "Sections",  icon: BookOpen },
  { id: "pipeline",  label: "Pipeline",  icon: GitBranch },
] as const;
type TabId = typeof TABS[number]["id"];

/* ─── Helpers ────────────────────────────────────────────────── */

function formatBudget(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function riskMeta(score: number) {
  if (score <= 25) return { bar: "var(--color-forest-500)", text: "text-forest-700", bg: "bg-forest-50", label: "Low Risk" };
  if (score <= 50) return { bar: "var(--color-gold-500)",   text: "text-gold-700",   bg: "bg-gold-50",   label: "Medium Risk" };
  if (score <= 75) return { bar: "#e67e22",                 text: "text-orange-700", bg: "bg-orange-50", label: "High Risk" };
  return           { bar: "var(--danger)",                  text: "text-red-700",    bg: "bg-red-50",    label: "Critical Risk" };
}

const sensitivityStyle: Record<string, string> = {
  public:       "bg-teal-50 text-teal-700 border-teal-100",
  internal:     "bg-gray-100 text-gray-600 border-gray-200",
  confidential: "bg-gold-50 text-gold-700 border-gold-100",
  restricted:   "bg-red-50 text-red-700 border-red-100",
};

/* ─── Section Row ────────────────────────────────────────────── */

function SectionRow({ title, content, confidence, aiSuggestion }: {
  title: string; content: string; confidence: number; aiSuggestion?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const confColor = confidence >= 90
    ? "text-forest-600 bg-forest-50 border-forest-100"
    : confidence >= 75
    ? "text-teal-600 bg-teal-50 border-teal-100"
    : "text-gold-600 bg-gold-50 border-gold-100";

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-gray-50 transition-colors group"
      >
        <FileText className="w-3.5 h-3.5 text-gray-300 shrink-0 group-hover:text-gray-400 transition-colors" />
        <span className="flex-1 text-[13px] font-medium text-gray-700 leading-snug">{title}</span>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 mr-1", confColor)}>
          {confidence}%
        </span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1 ml-6 space-y-3">
              <p className="text-[12.5px] text-gray-500 leading-relaxed whitespace-pre-line">{content}</p>
              {aiSuggestion && (
                <div className="flex items-start gap-2 rounded-lg bg-teal-50 border border-teal-100 px-3 py-2.5">
                  <Bot className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  <p className="text-[11.5px] text-teal-700 leading-snug">{aiSuggestion}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Pipeline Stage ─────────────────────────────────────────── */

function PipelineStage({ stage, index, total }: {
  stage: { stage: string; status: string; reviewer?: string; comments?: string; enterpriseReply?: string; enterpriseRepliedAt?: string };
  index: number; total: number;
}) {
  const isActive  = stage.stage === "glimmora_commercial";
  const done      = stage.status === "approved";
  const rejected  = stage.status === "rejected";
  const StageIcon = done ? CheckCircle2 : rejected ? AlertTriangle : isActive ? Clock : (STAGE_ICONS[stage.stage] || CircleDot);

  return (
    <div className={cn("flex gap-4 px-5 py-4", index < total - 1 && "border-b border-gray-100")}>
      <div className="flex flex-col items-center shrink-0">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center border",
          done     ? "border-forest-300 bg-forest-50" :
          rejected ? "border-amber-300 bg-amber-50" :
          isActive ? "border-gold-300 bg-gold-50" :
                     "border-gray-200 bg-gray-50",
        )}>
          <StageIcon className={cn("w-3.5 h-3.5",
            done ? "text-forest-500" : rejected ? "text-amber-500" : isActive ? "text-gold-600" : "text-gray-300",
          )} />
        </div>
        {index < total - 1 && (
          <div className={cn("w-px flex-1 mt-1.5 min-h-[20px]", done ? "bg-forest-200" : "bg-gray-100")} />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn("text-[12.5px] font-semibold leading-snug",
              done ? "text-gray-700" : isActive ? "text-gray-900" : "text-gray-400",
            )}>
              {STAGE_LABELS[stage.stage]}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{STAGE_DESC[stage.stage]}</p>
          </div>
          <span className={cn(
            "shrink-0 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md mt-0.5",
            done     ? "bg-forest-50 text-forest-700 border border-forest-100" :
            rejected ? "bg-amber-50 text-amber-700 border border-amber-100" :
            isActive ? "bg-gold-50 text-gold-700 border border-gold-100" :
                       "bg-gray-50 text-gray-400 border border-gray-100",
          )}>
            {done ? "Approved" : rejected ? "Changes Requested" : isActive ? "In Review" : "Pending"}
          </span>
        </div>

        {stage.reviewer && (
          <p className="text-[11px] text-gray-400 mt-1.5">
            Reviewer: <span className="font-medium text-gray-600">{stage.reviewer}</span>
          </p>
        )}

        {done && stage.comments && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-[11px] text-gray-400 italic">&ldquo;{stage.comments}&rdquo;</p>
          </div>
        )}

        {rejected && stage.comments && (
          <div className="mt-2.5 space-y-2">
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5">
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1">Changes Requested</p>
              <p className="text-[11.5px] text-amber-900 leading-relaxed">{stage.comments}</p>
            </div>
            {stage.enterpriseReply ? (
              <div className="flex gap-2">
                <CornerDownRight className="w-3 h-3 text-gray-300 mt-1 shrink-0" />
                <div className="flex-1 rounded-lg bg-teal-50 border border-teal-100 px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide">Enterprise Reply</p>
                    {stage.enterpriseRepliedAt && <p className="text-[10px] text-teal-400">{formatDate(stage.enterpriseRepliedAt)}</p>}
                  </div>
                  <p className="text-[11.5px] text-teal-900 leading-relaxed">{stage.enterpriseReply}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-200">
                <Clock className="w-3 h-3 text-gray-300 shrink-0" />
                <p className="text-[11px] text-gray-400">Awaiting enterprise response…</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function AdminSOWApprovePage() {
  const params = useParams();
  const router = useRouter();
  const sowId  = params.sowId as string;

  const sow      = mockSOWs.find(s => s.id === sowId) ?? null;
  const sections = mockSOWSections.filter(s => s.sowId === sowId).sort((a, b) => a.order - b.order);

  const [tab, setTab]                               = React.useState<TabId>("overview");
  const [checked, setChecked]                       = React.useState<Record<string, boolean>>({});
  const [notes, setNotes]                           = React.useState("");
  const [panelMode, setPanelMode]                   = React.useState<"checklist" | "reject">("checklist");
  const [rejectionReason, setRejectionReason]       = React.useState("");
  const [approvalSubmitted, setApprovalSubmitted]   = React.useState(false);
  const [rejectionSubmitted, setRejectionSubmitted] = React.useState(false);
  const [followUpSent, setFollowUpSent]             = React.useState(false);
  const [composerFiles, setComposerFiles]           = React.useState<Array<{ name: string; size: number; type: string }>>([]);
  const composerFileRef                             = React.useRef<HTMLInputElement>(null);

  const checkedCount = COMMERCIAL_CHECKLIST.filter(item => checked[item.id]).length;
  const allChecked   = checkedCount === COMMERCIAL_CHECKLIST.length;

  if (!sow) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
          <FileText className="w-5 h-5 text-gray-300" />
        </div>
        <p className="text-[14px] font-semibold text-gray-800 mb-1">SOW not found</p>
        <p className="text-[12px] text-gray-400 mb-5">This document may have been removed or is unavailable.</p>
        <Link href="/admin/sow" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brown-600 hover:text-brown-800 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to SOW Oversight
        </Link>
      </div>
    );
  }

  const glimmoraStage      = sow.approvalStages.find(s => s.stage === "glimmora_commercial");
  const isChangesRequested = glimmoraStage?.status === "rejected";
  const isFollowUp         = isChangesRequested && !!glimmoraStage?.enterpriseReply;
  const risk               = riskMeta(sow.riskScore.overall);

  function handleApprove() {
    setApprovalSubmitted(true);
    setPanelMode("checklist");
    setTimeout(() => router.push("/admin/sow"), 2200);
  }

  function handleReject() {
    if (!isFollowUp && !rejectionReason.trim() && composerFiles.length === 0) return;
    setComposerFiles([]);
    if (isFollowUp) {
      setFollowUpSent(true);
      setRejectionReason("");
      setPanelMode("checklist");
    } else {
      setRejectionSubmitted(true);
      setPanelMode("checklist");
      setTimeout(() => router.push("/admin/sow"), 2500);
    }
  }

  /* ── Success screens ── */
  if (approvalSubmitted || rejectionSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center max-w-sm mx-auto"
      >
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5",
          approvalSubmitted ? "bg-forest-500" : "bg-amber-500",
        )}>
          {approvalSubmitted
            ? <CheckCircle2 className="w-7 h-7 text-white" />
            : <AlertTriangle className="w-7 h-7 text-white" />}
        </div>
        <h2 className="font-heading text-[20px] font-bold text-gray-900 mb-2">
          {approvalSubmitted ? "Commercial Stage Approved" : "Changes Requested"}
        </h2>
        <p className="text-[13px] text-gray-400 leading-relaxed">
          {approvalSubmitted
            ? "This SOW advances to Legal / Compliance review. Redirecting…"
            : "Sent back to the enterprise admin for revision. Redirecting…"}
        </p>
      </motion.div>
    );
  }

  /* ── Main layout ── */
  return (
    <div className="-mx-6 -mt-2 flex flex-col" style={{ minHeight: "calc(100vh - 60px)" }}>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 shrink-0">

        {/* Top bar: back + meta */}
        <div className="px-6 pt-5 pb-4">
          <Link
            href="/admin/sow"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            SOW Oversight
          </Link>

          <div className="flex items-start justify-between gap-6">
            {/* Left: title + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border",
                  isChangesRequested ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gold-50 text-gold-700 border-gold-200",
                )}>
                  <Clock className="w-2.5 h-2.5" />
                  {isChangesRequested ? "Changes Requested" : "Awaiting Commercial Review"}
                </span>
                {sow.riskScore.overall > 0 && (
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border",
                    risk.bg, risk.text,
                    sow.riskScore.overall <= 25 ? "border-forest-100" : sow.riskScore.overall <= 50 ? "border-gold-100" : "border-red-100",
                  )}>
                    <Shield className="w-2.5 h-2.5" />
                    {risk.label}
                  </span>
                )}
                <span className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border",
                  sensitivityStyle[sow.dataSensitivity] ?? "bg-gray-100 text-gray-600 border-gray-200",
                )}>
                  <Lock className="w-2.5 h-2.5" />
                  {sow.dataSensitivity}
                </span>
              </div>

              <h1 className="font-heading text-[22px] font-bold text-gray-900 tracking-tight leading-tight mb-1.5">
                {sow.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" />
                  <span className="font-medium text-gray-600">{sow.client}</span>
                </span>
                {sow.industry && <><span className="text-gray-200">|</span><span>{sow.industry}</span></>}
                <span className="text-gray-200">|</span>
                <span>Submitted by <span className="font-medium text-gray-600">{sow.createdBy}</span></span>
                <span className="text-gray-200">|</span>
                <span>{formatDate(sow.updatedAt)}</span>
              </div>
            </div>

            {/* Right: stat tiles */}
            <div className="flex items-center gap-2 shrink-0">
              {[
                { icon: DollarSign, label: "Contract Value", value: formatBudget(sow.estimatedBudget) },
                { icon: Calendar,   label: "Duration",       value: sow.estimatedDuration },
                { icon: BookOpen,   label: "Pages",          value: String(sow.pages) },
                { icon: Gauge,      label: "AI Confidence",  value: `${sow.aiConfidence}%` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 min-w-[76px]">
                  <Icon className="w-3.5 h-3.5 text-gray-300 mb-1.5" />
                  <p className="text-[14px] font-bold text-gray-900 leading-none">{value}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 mt-1 text-center leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change request thread — only when applicable */}
        {isChangesRequested && glimmoraStage?.comments && (
          <div className="mx-6 mb-4 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Glimmora message */}
            <div className="flex gap-3 px-4 py-3.5 bg-amber-50 border-b border-amber-100">
              <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-amber-900">GlimmoraTeam Admin</span>
                  <span className="text-[10px] text-amber-400">{glimmoraStage.reviewedAt ? formatDate(glimmoraStage.reviewedAt) : ""}</span>
                  <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                    Changes Requested
                  </span>
                </div>
                <p className="text-[12px] text-amber-800 leading-relaxed">{glimmoraStage.comments}</p>
              </div>
            </div>

            {/* Enterprise reply */}
            {glimmoraStage.enterpriseReply && !followUpSent && (
              <div className="flex gap-3 px-4 py-3.5 bg-white">
                <CornerDownRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-2.5 h-2.5 text-teal-600" />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-800">Enterprise Admin</span>
                    <span className="text-[10px] text-gray-400">
                      {glimmoraStage.enterpriseRepliedAt ? formatDate(glimmoraStage.enterpriseRepliedAt) : ""}
                    </span>
                    <button
                      onClick={() => setPanelMode("reject")}
                      className="ml-auto inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 transition-colors"
                    >
                      <MessageSquare className="w-2.5 h-2.5" /> Reply
                    </button>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{glimmoraStage.enterpriseReply}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex px-6 gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold border-b-2 transition-all",
                tab === id
                  ? "border-brown-600 text-brown-950"
                  : "border-transparent text-gray-400 hover:text-gray-700",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {id === "sections" && sections.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gray-100 text-gray-500">
                  {sections.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0 bg-gray-50">

        {/* Left — scrollable content */}
        <div className="flex-1 min-w-0">
          <div className="px-6 py-6 space-y-4">

            {/* ── OVERVIEW TAB ── */}
            {tab === "overview" && (
              <>
                {/* Stakeholders + Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Users className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stakeholders</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(sow.stakeholders ?? []).map(s => (
                        <span key={s} className="inline-flex items-center text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-gray-100 shadow-sm px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Tag className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(sow.tags ?? []).map(t => (
                        <span key={t} className="text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Breakdown */}
                {sow.riskScore.overall > 0 && (
                  <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Risk Score Breakdown</p>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md", risk.bg, risk.text)}>
                        {sow.riskScore.overall}/100 · {risk.label}
                      </span>
                    </div>
                    <div className="px-5 py-4 space-y-3.5">
                      {[
                        { label: "Completeness",  value: sow.riskScore.completeness },
                        { label: "Confidence",    value: sow.riskScore.confidence },
                        { label: "Compliance",    value: sow.riskScore.compliance },
                        { label: "Pattern Match", value: sow.riskScore.patternMatch },
                      ].map(({ label, value }) => {
                        const c = riskMeta(value);
                        return (
                          <div key={label} className="flex items-center gap-4">
                            <span className="text-[11px] text-gray-500 w-28 shrink-0">{label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${value}%`, background: c.bar }} />
                            </div>
                            <span className="font-mono text-[11px] font-semibold w-7 text-right" style={{ color: c.bar }}>
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hallucination Flags */}
                {(sow.hallucinationFlags ?? []).length > 0 ? (
                  <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Hallucination Flags</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                        {sow.hallucinationFlags!.length} flag{sow.hallucinationFlags!.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {sow.hallucinationFlags!.map(flag => (
                        <div key={flag.id} className="px-5 py-3.5 flex items-start gap-3">
                          <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                            flag.severity === "high" ? "bg-red-500" : flag.severity === "medium" ? "bg-amber-400" : "bg-teal-400",
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-gray-700 mb-0.5 italic">&ldquo;{flag.clause}&rdquo;</p>
                            <p className="text-[11px] text-gray-400 mb-1 leading-snug">{flag.reason}</p>
                            {flag.suggestion && <p className="text-[11px] text-teal-600">Suggestion: {flag.suggestion}</p>}
                          </div>
                          <span className={cn("shrink-0 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border",
                            flag.severity === "high" ? "bg-red-50 text-red-700 border-red-100" :
                            flag.severity === "medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-teal-50 text-teal-700 border-teal-100",
                          )}>
                            {flag.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-forest-50 border border-forest-100 px-5 py-4 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-forest-700">No hallucination flags detected</p>
                      <p className="text-[11px] text-forest-600 mt-0.5">AI extraction passed all clause integrity checks.</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── SECTIONS TAB ── */}
            {tab === "sections" && (
              <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Parsed Sections</p>
                  <span className="text-[11px] text-gray-400">
                    {sections.length > 0 ? `${sections.length} sections · v${sow.version}` : "No sections extracted"}
                  </span>
                </div>
                {sections.length > 0 ? (
                  sections.map(s => (
                    <SectionRow key={s.id} title={s.title} content={s.content} confidence={s.confidence} aiSuggestion={s.aiSuggestion} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-center px-8">
                    <Layers className="w-8 h-8 text-gray-200 mb-3" />
                    <p className="text-[13px] font-medium text-gray-600 mb-1">No sections extracted</p>
                    <p className="text-[11px] text-gray-400">This SOW has not yet been processed by the AI extraction engine.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── PIPELINE TAB ── */}
            {tab === "pipeline" && (
              <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Approval Pipeline</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">5-stage review — currently at GlimmoraTeam Commercial</p>
                </div>
                {sow.approvalStages.map((stage, i) => (
                  <PipelineStage key={stage.stage} stage={stage} index={i} total={sow.approvalStages.length} />
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right — sticky approval panel */}
        <div className="w-[340px] shrink-0 border-l border-gray-100 bg-white overflow-hidden">
          <div className="sticky top-0 max-h-screen overflow-y-auto">

            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Commercial Review</p>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gold-50 text-gold-700 border border-gold-100">
                  Stage 2 of 5
                </span>
              </div>
              <p className="text-[13px] font-semibold text-gray-900">GlimmoraTeam Commercial</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                Rate cards, budget viability & commercial terms
              </p>
            </div>

            <AnimatePresence mode="wait">

              {/* ── Checklist mode ── */}
              {panelMode === "checklist" && (
                <motion.div
                  key="checklist"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
                >
                  {/* Progress bar */}
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-gray-700">Verification Checklist</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md",
                        allChecked ? "bg-forest-50 text-forest-700 border border-forest-100" : "bg-gray-100 text-gray-500",
                      )}>
                        {checkedCount} / {COMMERCIAL_CHECKLIST.length}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", allChecked ? "bg-forest-500" : "bg-brown-400")}
                        initial={{ width: 0 }}
                        animate={{ width: `${(checkedCount / COMMERCIAL_CHECKLIST.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 pb-4 space-y-1">
                    {COMMERCIAL_CHECKLIST.map(item => {
                      const isChecked = !!checked[item.id];
                      return (
                        <label
                          key={item.id}
                          className={cn(
                            "flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all",
                            isChecked ? "bg-forest-50" : "hover:bg-gray-50",
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={val => setChecked(prev => ({ ...prev, [item.id]: !!val }))}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-[12px] font-medium leading-snug transition-colors",
                              isChecked ? "text-forest-700" : "text-gray-700",
                            )}>
                              {item.label}
                            </p>
                            <p className="text-[10.5px] text-gray-400 mt-0.5 leading-snug">{item.description}</p>
                          </div>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 shrink-0 mt-0.5" />}
                        </label>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  <div className="px-5 pt-3 pb-4 border-t border-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Internal Notes</p>
                    <Textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Optional notes or conditions for this stage…"
                      className="min-h-[72px] text-[12px] resize-none bg-gray-50 border-gray-100"
                    />
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-50 space-y-2">
                    <button
                      disabled={!allChecked}
                      onClick={handleApprove}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-xl transition-all",
                        allChecked
                          ? "text-white bg-brown-950 hover:bg-brown-800 shadow-sm"
                          : "text-gray-400 bg-gray-100 cursor-not-allowed",
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {allChecked ? "Approve Commercial Stage" : `Complete all ${COMMERCIAL_CHECKLIST.length} checks`}
                    </button>
                    <button
                      onClick={() => setPanelMode("reject")}
                      className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold text-amber-700 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Request Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Request Changes / Thread mode ── */}
              {panelMode === "reject" && (
                <motion.div
                  key="reject"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
                  className="flex flex-col"
                >
                  {/* Thread header */}
                  <div className="px-5 pt-4 pb-3.5 border-b border-gray-50 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-[12.5px] font-semibold text-gray-900">Change Request Thread</p>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">Commercial review conversation</p>
                    </div>
                  </div>

                  {/* Thread messages */}
                  {isChangesRequested && glimmoraStage?.comments && (
                    <div className="px-5 py-4 space-y-3">

                      {/* Glimmora bubble */}
                      <div className="flex gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-[11px] font-semibold text-gray-800">You</span>
                            <span className="text-[10px] text-gray-400">
                              {glimmoraStage.reviewedAt ? formatDate(glimmoraStage.reviewedAt) : ""}
                            </span>
                          </div>
                          <div className="rounded-xl rounded-tl-none bg-amber-50 border border-amber-100 px-3 py-2.5">
                            <p className="text-[11.5px] text-amber-900 leading-relaxed">{glimmoraStage.comments}</p>
                          </div>
                        </div>
                      </div>

                      {/* Enterprise reply bubble */}
                      {glimmoraStage.enterpriseReply && !followUpSent ? (
                        <div className="flex gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 className="w-3 h-3 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-1.5 mb-1">
                              <span className="text-[11px] font-semibold text-gray-800">Enterprise Admin</span>
                              <span className="text-[10px] text-gray-400">
                                {glimmoraStage.enterpriseRepliedAt ? formatDate(glimmoraStage.enterpriseRepliedAt) : ""}
                              </span>
                              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-600 border border-teal-100">
                                Reply
                              </span>
                            </div>
                            <div className="rounded-xl rounded-tl-none bg-teal-50 border border-teal-100 px-3 py-2.5">
                              <p className="text-[11.5px] text-teal-900 leading-relaxed">{glimmoraStage.enterpriseReply}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        !followUpSent && (
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-200 bg-gray-50">
                            <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            <p className="text-[11px] text-gray-400">Awaiting enterprise response…</p>
                          </div>
                        )
                      )}

                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                          {isFollowUp && !followUpSent ? "Send Follow-up" : "New Request"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Composer */}
                  <div className={cn("px-5 pb-5", !(isChangesRequested && glimmoraStage?.comments) && "pt-4")}>
                    {!(isChangesRequested && glimmoraStage?.comments) && (
                      <p className="text-[11px] text-gray-400 mb-3 leading-snug">
                        Describe what needs to be addressed before this SOW can proceed.
                      </p>
                    )}

                    {/* Textarea */}
                    <Textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder={isFollowUp && !followUpSent
                        ? "Type a follow-up message…"
                        : "e.g. Budget range too low. Rate cards for senior roles are missing."}
                      className="min-h-[96px] text-[12px] resize-none bg-gray-50 border-gray-100 mb-2"
                      autoFocus
                    />

                    {/* Attached file chips */}
                    <AnimatePresence>
                      {composerFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mb-2"
                        >
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {composerFiles.map((f, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 max-w-full"
                              >
                                <div className="w-5 h-5 rounded-md bg-brown-50 flex items-center justify-center shrink-0">
                                  {f.type.startsWith("image/")
                                    ? <ImageIcon className="w-3 h-3 text-brown-500" />
                                    : <File className="w-3 h-3 text-brown-500" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-medium text-gray-700 truncate max-w-[130px]">{f.name}</p>
                                  <p className="text-[9px] text-gray-400">
                                    {f.size < 1024 * 1024
                                      ? `${(f.size / 1024).toFixed(1)} KB`
                                      : `${(f.size / (1024 * 1024)).toFixed(1)} MB`}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setComposerFiles(prev => prev.filter((_, j) => j !== i))}
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all shrink-0"
                                >
                                  <XCircle className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hidden file input */}
                    <input
                      ref={composerFileRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                      className="hidden"
                      onChange={e => {
                        const files = Array.from(e.target.files ?? []);
                        setComposerFiles(prev => [
                          ...prev,
                          ...files.map(f => ({ name: f.name, size: f.size, type: f.type })),
                        ]);
                        e.target.value = "";
                      }}
                    />

                    {/* Actions row */}
                    <div className="flex gap-2 items-center">
                      {/* Attach */}
                      <button
                        onClick={() => composerFileRef.current?.click()}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brown-500 hover:bg-brown-50 border border-gray-200 hover:border-brown-200 transition-all shrink-0"
                        title="Attach file"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => { setPanelMode("checklist"); setRejectionReason(""); setComposerFiles([]); }}
                        className="flex-1 text-[12px] font-medium text-gray-500 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!isFollowUp && !rejectionReason.trim() && composerFiles.length === 0}
                        onClick={handleReject}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold py-2.5 rounded-xl transition-all",
                          (isFollowUp || rejectionReason.trim() || composerFiles.length > 0)
                            ? "text-white bg-amber-500 hover:bg-amber-600 shadow-sm"
                            : "text-gray-400 bg-gray-100 cursor-not-allowed",
                        )}
                      >
                        <Send className="w-3.5 h-3.5" /> Send
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
