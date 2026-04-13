"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowRight, Target, Users, Lightbulb,
  LayoutList, Sparkles, ShieldCheck, AlertTriangle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { FlowStepProgress } from "@/components/enterprise/sow/FlowStepProgress";
import { KpiRow } from "@/components/enterprise/sow/KpiRow";
import { StatusBanner } from "@/components/enterprise/sow/StatusBanner";
import { SowBadge } from "@/components/enterprise/sow/SowBadge";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { useExtractionReport, useUploadStatus } from "@/lib/hooks/use-manual-sow";

/* ── helpers ── */

type Raw = Record<string, unknown>;

function pick<T>(raw: Raw, camel: string, snake: string, fallback: T): T {
  return (raw[camel] ?? raw[snake] ?? fallback) as T;
}

type DetectionStatus = "PRESENT" | "PARTIAL" | "ABSENT";

function toStatus(v: unknown): DetectionStatus {
  const s = String(v ?? "").toUpperCase();
  if (s === "PRESENT") return "PRESENT";
  if (s === "PARTIAL") return "PARTIAL";
  return "ABSENT";
}

/* ── static config ── */

const contextRows = [
  { key: "business_objectives", camel: "businessObjectives", label: "Business Objectives", icon: Target },
  { key: "pain_points",         camel: "painPoints",         label: "Pain Points",         icon: Lightbulb },
  { key: "user_context",        camel: "userContext",        label: "User Context",        icon: Users },
] as const;

const detectionStyles: Record<DetectionStatus, { variant: "forest" | "gold" | "danger"; label: string }> = {
  PRESENT: { variant: "forest", label: "Present" },
  PARTIAL:  { variant: "gold",   label: "Partial" },
  ABSENT:   { variant: "danger", label: "Absent"  },
};

const sensitiveStyles: Record<string, { variant: string; label: string }> = {
  none:     { variant: "forest",  label: "None Detected" },
  possible: { variant: "gold",    label: "Possible"      },
  explicit: { variant: "danger",  label: "Detected"      },
};

/* ═══ PAGE ═══ */

export default function ExtractionReportPage() {
  const router = useRouter();
  const store  = useSOWUploadStore();
  const sowId  = store.uploadedSowId;

  // Poll upload-status until processing is done
  const { data: statusRes, isLoading: statusLoading } = useUploadStatus(sowId);
  const statusData  = (statusRes?.data ?? statusRes) as Raw | null;
  const uploadStatus = statusData?.status as string | undefined;
  const isProcessing =
    statusLoading ||
    (!!sowId && !!uploadStatus && uploadStatus !== "completed" && uploadStatus !== "complete" && uploadStatus !== "failed" && uploadStatus !== "error");

  // Fetch extraction report only when upload is done
  const { data: reportRes, isLoading: reportLoading } = useExtractionReport(
    isProcessing ? null : sowId,
  );

  // The actual report data — API returns { sow_id, report: {...} }
  // Try: .data.report → .data → .report → top-level
  const raw = React.useMemo<Raw | null>(() => {
    if (!reportRes) return null;
    const res = reportRes as unknown as Record<string, unknown>;
    const d = res.data as Record<string, unknown> | null;

    // Most likely shape: { data: { sow_id, report: {...} } }
    if (d?.report && typeof d.report === "object") return d.report as Raw;
    // Flat shape: { data: { sectionsFound, ... } }
    if (d && Object.keys(d).length > 0) return d as Raw;
    // Shape without wrapper: { sow_id, report: {...} }
    if (res.report && typeof res.report === "object") return res.report as Raw;
    // Shape without wrapper flat
    if (Object.keys(res).length > 0) return res as Raw;
    return null;
  }, [reportRes]);

  const handleViewParsedSOW = () => {
    store.setFlowStep(3);
    router.push("/enterprise/sow/upload/review");
  };

  const handleUploadAnother = () => {
    store.reset();
    router.push("/enterprise/sow/upload");
  };

  // ── Processing / loading skeleton ──
  if (isProcessing || reportLoading) {
    return (
      <div>
        <div className="mb-6"><FlowStepProgress currentStep={2} /></div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        {/* Card */}
        <div className="card-parchment overflow-hidden">
          {/* KPI row */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Context Detection + Sensitive Data */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="px-5 py-4 space-y-3">
              <Skeleton className="h-2.5 w-28" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="w-3.5 h-3.5 rounded shrink-0" />
                  <Skeleton className="h-3 w-28 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
            <div className="px-5 py-4 space-y-3">
              <Skeleton className="h-2.5 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          {/* Action row */}
          <div className="px-5 py-4 flex justify-end gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── No data state ──
  if (!raw) {
    return (
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="mb-6">
          <FlowStepProgress currentStep={2} />
        </motion.div>
        <motion.div variants={fadeUp} className="card-parchment px-8 py-12 flex flex-col items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-gold-500" />
          <p className="text-[14px] font-semibold text-gray-700">No extraction report available</p>
          <p className="text-[12px] text-gray-400 text-center max-w-sm">
            SOW ID: {sowId ?? "not set"} — Upload status: {uploadStatus ?? "unknown"}
          </p>
          <button onClick={handleUploadAnother}
            className="mt-2 text-[12px] font-semibold text-white bg-gradient-to-r from-gray-400 to-gray-500 px-4 py-2.5 rounded-xl uppercase">
            Re-upload
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // ── Derive display values from raw API data ──
  const sectionsFound  = pick<number>(raw, "sectionsFound",  "sections_found",  0);
  const aiConfidence   = pick<number>(raw, "aiConfidence",   "ai_confidence",   0);
  const gapScore       = pick<number>(raw, "gapScore",       "gap_score",       0);
  const ambiguities    = pick<number>(raw, "ambiguities",    "ambiguities",     0);
  const sensDetected   = pick<string>(raw, "sensitiveDataDetected", "sensitive_data_detected", "none");
  const sensTypes      = pick<string[]>(raw, "sensitiveDataTypes",  "sensitive_data_types",    []);
  const rawCtx         = (pick<Raw | null>(raw, "contextDetection", "context_detection", null) ?? {}) as Raw;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Flow step progress */}
      <motion.div variants={fadeUp} className="mb-6">
        <FlowStepProgress currentStep={2} />
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight">
              Extraction Intelligence Report
            </h1>
            <p className="mt-1.5 text-[13px] text-gray-500">
              AI has successfully parsed {store.uploadedFile?.name || "your document"}.
            </p>
          </div>
          <span className="text-[10px] font-semibold text-forest-700 bg-forest-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3 h-3" /> PARSING COMPLETE
          </span>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div variants={fadeUp} className="card-parchment overflow-hidden">

        {/* KPI Row */}
        <div className="px-5 py-5 border-b border-gray-100">
          <KpiRow items={[
            { label: "Sections Found", value: sectionsFound,       icon: LayoutList,    iconBg: "bg-gradient-to-br from-brown-400 to-brown-600"  },
            { label: "AI Confidence",  value: `${aiConfidence}%`,  icon: Sparkles,      iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
            { label: "Gap Score",      value: `${gapScore}%`,      icon: ShieldCheck,   iconBg: "bg-gradient-to-br from-teal-400 to-teal-600"    },
            { label: "Ambiguities",    value: ambiguities,         icon: AlertTriangle, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600"    },
          ]} />
        </div>

        {/* Context Detection + Sensitive Data */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">

          {/* Left: Context Detection */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Context Detection</p>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              {contextRows.map((row, i) => {
                const status = toStatus(rawCtx[row.key] ?? rawCtx[row.camel]);
                const style  = detectionStyles[status];
                const Icon   = row.icon;
                return (
                  <div
                    key={row.key}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 bg-white",
                      i < contextRows.length - 1 && "border-b border-gray-100",
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 text-brown-400 shrink-0" />
                    <span className="text-[12px] font-medium text-gray-700 flex-1">{row.label}</span>
                    <SowBadge variant={style.variant} dot>{style.label}</SowBadge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sensitive Data */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Sensitive Data</p>
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-5 h-[calc(100%-28px)]">
              <div className="flex items-center justify-between mb-3">
                <span className="label-caps">Detection</span>
                <SowBadge variant={(sensitiveStyles[sensDetected] ?? sensitiveStyles["none"]).variant}>
                  {(sensitiveStyles[sensDetected] ?? sensitiveStyles["none"]).label}
                </SowBadge>
              </div>
              {Array.isArray(sensTypes) && sensTypes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {sensTypes.map((t) => (
                    <span key={t} className="text-[10px] text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Warning banner */}
        {(gapScore < 80 || ambiguities > 3) && (
          <div className="px-5 py-4 border-b border-gray-100">
            <StatusBanner
              variant="warning"
              title="Review recommended before proceeding"
              description={`${ambiguities} ambiguities and ${100 - gapScore}% of standard sections are missing. These will be addressed in the Gap Analysis step.`}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 bg-gray-50/40">
          <button
            onClick={handleUploadAnother}
            className="text-[12px] font-semibold text-white bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 px-4 py-2.5 rounded-xl transition-all uppercase"
          >
            Wrong File? Re-upload
          </button>
          <button
            onClick={handleViewParsedSOW}
            className="flex items-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-6 py-2.5 rounded-xl transition-all uppercase"
          >
            View Parsed SOW <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
