"use client";

import { Skeleton } from "@/components/ui";

/* ═══════════════════════════════════════════════════════════
   DASHBOARD SKELETON
   Layout: Header → 6 KPI tiles → 2-col (attention + pipeline) → 2-col (financial + activity)
   ═══════════════════════════════════════════════════════════ */
export function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* KPI tiles — 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        ))}
      </div>

      {/* Two-column: Attention + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Attention panel */}
        <div className="lg:col-span-3 rounded-2xl border border-beige-200/50 bg-white/70 p-5 space-y-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-beige-100/60 last:border-0">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
        {/* Pipeline */}
        <div className="lg:col-span-2 rounded-2xl border border-beige-200/50 bg-white/70 p-5 space-y-4">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-24 flex-1" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Financial + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 p-5 space-y-4">
          <Skeleton className="h-4 w-36" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 p-5 space-y-3">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-14 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOW LIST SKELETON
   Layout: Header + filters → KPI tiles → sortable table
   ═══════════════════════════════════════════════════════════ */
export function SOWListSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 px-5 py-3 border-b border-beige-200/60 bg-beige-50/40">
          {["w-32", "w-20", "w-16", "w-20", "w-14", "w-12", "w-16"].map((w, i) => (
            <Skeleton key={i} className={`h-2.5 ${w}`} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 px-5 py-4 border-b border-beige-100/60 last:border-0">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
            <Skeleton className="h-3 w-20 self-center" />
            <Skeleton className="h-5 w-16 rounded-full self-center" />
            <Skeleton className="h-5 w-18 rounded-full self-center" />
            <Skeleton className="h-3 w-10 self-center" />
            <Skeleton className="h-3 w-6 self-center" />
            <Skeleton className="h-3 w-16 self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOW APPROVAL PIPELINE SKELETON
   Layout: Header → 5-stage pipeline columns
   ═══════════════════════════════════════════════════════════ */
export function SOWApprovalSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-3.5 w-80" />
      </div>

      {/* Pipeline stages — 5 columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 space-y-4">
            {/* Stage header */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            {/* SOW cards in stage */}
            {Array.from({ length: i < 2 ? 2 : 1 }).map((_, j) => (
              <div key={j} className="rounded-xl border border-beige-100 p-3 space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DECOMPOSITION SKELETON
   Layout: Header → 5 KPI cards → search + filter → table
   ═══════════════════════════════════════════════════════════ */
export function DecompositionSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* KPI row — 5 cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-beige-200/60 bg-beige-50/40">
          {["w-28", "w-24", "w-16", "w-12", "w-16"].map((w, i) => (
            <Skeleton key={i} className={`h-2.5 ${w}`} />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-beige-100/60 last:border-0 items-center">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEAMS SKELETON
   Layout: Header + info box → 5 KPI cards → search + filter → team grid
   ═══════════════════════════════════════════════════════════ */
export function TeamsSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {/* Info box */}
      <Skeleton className="h-12 w-full rounded-xl" />

      {/* KPI row — 5 cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 text-center space-y-2">
            <Skeleton className="h-6 w-10 mx-auto" />
            <Skeleton className="h-2.5 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Team rows */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-beige-100/60 last:border-0">
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-2.5 w-32" />
            </div>
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-3 w-12" />
            <div className="w-24 space-y-1">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2.5 w-10" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXCEPTIONS SKELETON
   Layout: Header → 6 KPI cards → filters → table
   ═══════════════════════════════════════════════════════════ */
export function ExceptionsSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* KPI tiles — 6 cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 space-y-2">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
        <Skeleton className="h-10 w-48 rounded-xl ml-auto" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 px-5 py-3 border-b border-beige-200/60 bg-beige-50/40">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 w-14" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 px-5 py-4 border-b border-beige-100/60 last:border-0 items-center">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW QUEUE SKELETON
   Layout: Header → 4 stat cards with rings → tabs → 3-col card grid
   ═══════════════════════════════════════════════════════════ */
export function ReviewQueueSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Stat cards — 4 with metric rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Card grid — 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW HISTORY SKELETON
   Layout: Breadcrumb → Header → 4 metric cards → filter bar → table
   ═══════════════════════════════════════════════════════════ */
export function ReviewHistorySkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Breadcrumb + header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-36" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* Metric cards — 4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 px-5 py-3 border-b border-beige-200/60 bg-beige-50/40">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 w-16" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 px-5 py-4 border-b border-beige-100/60 last:border-0 items-center">
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-18 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BILLING SKELETON
   Layout: Header → 4 KPI cards → 2-col (chart + payout table) → avg payment
   ═══════════════════════════════════════════════════════════ */
export function BillingSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-3.5 w-56" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* KPI cards — 4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-beige-200/50 bg-white/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </div>

      {/* Two-column: chart + payout table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 rounded-2xl border border-beige-200/50 bg-white/70 p-5 space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-end gap-2 h-40">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${30 + Math.random() * 70}%` }} />
            ))}
          </div>
        </div>
        {/* Payout table */}
        <div className="lg:col-span-3 rounded-2xl border border-beige-200/50 bg-white/70 p-5 space-y-3">
          <Skeleton className="h-4 w-36" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-beige-100/60 last:border-0">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-3 w-1/3 flex-1" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Avg payment time */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-2 w-full mt-3" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS SKELETON
   Layout: Header → 2-col (sidebar tabs + content panel)
   ═══════════════════════════════════════════════════════════ */
export function SettingsSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3.5 w-64" />
      </div>

      {/* Two-column: sidebar + content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        {/* Content panel */}
        <div className="md:col-span-3 rounded-2xl border border-beige-200/50 bg-white/70 p-6 space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-px w-full" />
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
