"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
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
  Ban,
  Filter,
  ArrowRight,
} from "lucide-react";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";
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
   Style helpers
   ══════════════════════════════════════════════════════════════ */

const R: Record<string, string> = { forest: "77,87,65", teal: "91,155,162", gold: "208,176,96", brown: "166,119,99", beige: "201,176,157" };
const C: Record<string, string> = { forest: "#4D5741", teal: "#5B9BA2", gold: "#86713D", brown: "#A67763", beige: "var(--ink-faint)" };

function bx(v: string, sz = 36): React.CSSProperties {
  const r = R[v] || R.beige;
  return { width: sz, height: sz, borderRadius: sz > 30 ? 10 : 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `linear-gradient(135deg, rgba(${r},0.14), rgba(${r},0.06))`, border: `1px solid rgba(${r},0.20)` };
}

function bg(v: string): React.CSSProperties {
  const r = R[v] || R.beige; const c = C[v] || "var(--ink-muted)";
  return { background: `rgba(${r},${v === "gold" ? "0.12" : "0.10"})`, color: c, border: `1px solid rgba(${r},${v === "gold" ? "0.25" : "0.20"})`, display: "inline-flex", alignItems: "center", gap: 4 };
}

function cg(c: number) { return c >= 90 ? "linear-gradient(90deg, #4D5741, #949A8D)" : c >= 75 ? "linear-gradient(90deg, #5B9BA2, #8FC0C7)" : "linear-gradient(90deg, #D0B060, #E0CC8A)"; }
function cv(c: number) { return c >= 90 ? "forest" : c >= 75 ? "teal" : "gold"; }
function rv(r: number) { return r <= 25 ? "forest" : r <= 50 ? "gold" : "brown"; }

/* ── Config maps ── */
const sCfg: Record<string, { v: string; l: string }> = {
  draft: { v: "beige", l: "Draft" }, parsing: { v: "teal", l: "Parsing" }, review: { v: "teal", l: "In Review" },
  approval: { v: "gold", l: "In Approval" }, approved: { v: "forest", l: "Approved" }, archived: { v: "beige", l: "Archived" },
  rejected: { v: "brown", l: "Rejected" }, changes_requested: { v: "gold", l: "Changes Requested" },
};
const cCfg: Record<string, string> = { public: "teal", internal: "beige", confidential: "gold", restricted: "brown" };
const clCfg: Record<string, { l: string; v: string }> = {
  dependency: { l: "Dependency", v: "teal" }, assumption: { l: "Assumption", v: "beige" }, constraint: { l: "Constraint", v: "gold" },
  acceptance_criteria: { l: "Acceptance Criteria", v: "forest" }, ethical: { l: "Ethical", v: "teal" }, security: { l: "Security", v: "brown" },
  ip: { l: "IP", v: "gold" }, liability: { l: "Liability", v: "brown" }, confidentiality: { l: "Confidentiality", v: "beige" },
  sla: { l: "SLA", v: "teal" }, warranty: { l: "Warranty", v: "forest" }, termination: { l: "Termination", v: "beige" },
};
const auCfg: Record<string, { v: string; icon: React.ElementType }> = {
  created: { v: "teal", icon: FileText }, updated: { v: "gold", icon: ClipboardList }, approved: { v: "forest", icon: CheckCircle2 },
  submitted: { v: "brown", icon: Send }, parsed: { v: "teal", icon: Bot }, reviewed: { v: "gold", icon: Eye },
};

function fd(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fdt(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

/* ── Mock generators ── */
function genVersions(sow: (typeof mockSOWs)[0]) {
  const v = [];
  for (let i = sow.version; i >= 1; i--) {
    const d = new Date(sow.createdAt); d.setDate(d.getDate() + (i - 1) * 5);
    v.push({ version: i, date: d.toISOString(), status: i === sow.version ? sow.status : "draft", changedBy: i === 1 ? sow.createdBy : sow.approvedBy || sow.createdBy, intakeMode: sow.intakeMode, changes: i === sow.version && sow.status === "approved" ? "Final approval and sign-off" : i === 1 ? "Initial document upload" : `Revision ${i} -- updated scope and budget sections` });
  }
  return v;
}

type AE = { id: string; action: "created" | "updated" | "approved" | "submitted" | "parsed" | "reviewed"; actor: string; timestamp: string; details: string };
function genAudit(sow: (typeof mockSOWs)[0]) {
  const e: AE[] = [{ id: "a1", action: "created", actor: sow.createdBy, timestamp: sow.createdAt, details: `SOW "${sow.title}" ${sow.intakeMode === "ai_generated" ? "generated via AI wizard" : "uploaded manually"}` }];
  if (sow.parsedSections > 0) { const d = new Date(sow.createdAt); d.setMinutes(d.getMinutes() + 15); e.push({ id: "a1b", action: "parsed", actor: "AI Engine", timestamp: d.toISOString(), details: `AI extraction completed: ${sow.parsedSections} sections, ${mockSOWClauses.filter((c) => c.sowId === sow.id).length} clauses tagged` }); }
  if (sow.version > 1) { const d = new Date(sow.createdAt); d.setDate(d.getDate() + 3); e.push({ id: "a2", action: "updated", actor: sow.createdBy, timestamp: d.toISOString(), details: "Scope sections revised based on AI suggestions" }); }
  if (sow.status === "approval" || sow.status === "approved") { const d = new Date(sow.createdAt); d.setDate(d.getDate() + 5); e.push({ id: "a2b", action: "submitted", actor: sow.createdBy, timestamp: d.toISOString(), details: "SOW submitted for multi-stage approval" }); }
  if (sow.status === "approved" && sow.approvedBy) { e.push({ id: "a3", action: "approved", actor: sow.approvedBy, timestamp: sow.updatedAt, details: "SOW approved and locked for decomposition" }); }
  return e.reverse();
}

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "clauses", label: "Clauses", icon: Scale },
  { id: "document", label: "Document", icon: BookOpen },
  { id: "ai-risk", label: "AI & Risk", icon: Sparkles },
  { id: "history", label: "Approval & History", icon: CheckCircle2 },
];

/* ══════════════════════════════════════════════════════════════ */

export default function SOWDetailPage() {
  const params = useParams();
  const sowId = params.sowId as string;
  const sow = mockSOWs.find((s) => s.id === sowId) || mockSOWs[0];
  const linkedProject = mockProjects.find((p) => p.sowId === sow.id);
  const sections = mockSOWSections.filter((s) => s.sowId === sow.id);
  const clauses = mockSOWClauses.filter((c) => c.sowId === sow.id);
  const versions = genVersions(sow);
  const auditTrail = genAudit(sow);
  const ethicsScreening = mockEthicsScreening[sow.id] || [];
  const regulatoryItems = mockRegulatoryAlignment[sow.id] || [];
  const genParams = mockGenerationParams[sow.id];
  const hallucinationLayers = mockHallucinationLayers[sow.id] || [];
  const sensitivityReqs = sensitivityHandlingRequirements[sow.dataSensitivity] || [];

  const [tab, setTab] = React.useState("overview");
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(sections.slice(0, 3).map((s) => s.id)));
  const [showModal, setShowModal] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [clFilter, setClFilter] = React.useState("all");
  const [clSearch, setClSearch] = React.useState("");
  const [auFilter, setAuFilter] = React.useState("all");
  const [docSearch, setDocSearch] = React.useState("");

  const toggle = (id: string) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const valid = sow.parsedSections > 0 && sow.totalSections > 0;
  const confirm = () => { setSubmitted(true); setTimeout(() => setShowModal(false), 2000); };

  const fClauses = React.useMemo(() => {
    let l = [...clauses];
    if (clFilter !== "all") l = l.filter((c) => c.type === clFilter);
    if (clSearch.trim()) { const q = clSearch.toLowerCase(); l = l.filter((c) => c.text.toLowerCase().includes(q) || c.sectionRef.toLowerCase().includes(q)); }
    return l;
  }, [clauses, clFilter, clSearch]);
  const prohib = clauses.filter((c) => c.isProhibited).length;
  const clCounts = React.useMemo(() => { const m: Record<string, number> = {}; clauses.forEach((c) => { m[c.type] = (m[c.type] || 0) + 1; }); return m; }, [clauses]);
  const fAudit = React.useMemo(() => auFilter === "all" ? auditTrail : auditTrail.filter((e) => e.action === auFilter), [auditTrail, auFilter]);
  const fDocs = React.useMemo(() => { if (!docSearch.trim()) return sections; const q = docSearch.toLowerCase(); return sections.filter((s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)); }, [sections, docSearch]);

  const st = sCfg[sow.status] || sCfg.draft;


  /* ── Shared inline button styles ── */
  const btnPrimary: React.CSSProperties = { background: "linear-gradient(135deg, #A67763, #886151)", color: "#FFFFFF", border: "none", borderRadius: 10, padding: "8px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(166,119,99,0.20)" };
  const btnOutline: React.CSSProperties = { background: "transparent", color: "var(--ink-mid)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "8px 18px", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 };
  const searchInput: React.CSSProperties = { height: 32, paddingLeft: 30, paddingRight: 12, fontSize: 12, borderRadius: 10, border: "1px solid var(--border-soft)", background: "rgba(255,255,255,0.8)", color: "var(--ink)", outline: "none", width: 180 };

  /* ── Section header title (matches dashboard exactly) ── */
  const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' };

  /* ── List item hover handlers (matches dashboard pattern) ── */
  const hoverIn = (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = 'rgba(166,119,99,0.04)'; e.currentTarget.style.borderColor = 'var(--border-hair)'; };
  const hoverOut = (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══════════════════════════════════
          HERO HEADER (dashboard pattern — open, no card)
          ═══════════════════════════════════ */}
      <motion.div variants={fadeUp} className="relative mb-10">
        <div className="absolute pointer-events-none" style={{
          top: -60, left: -80, width: 500, height: 300,
          background: 'radial-gradient(ellipse at 20% 40%, rgba(208,176,96,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(91,155,162,0.06) 0%, transparent 45%), radial-gradient(ellipse at 50% 80%, rgba(166,119,99,0.05) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }} />

        <div className="relative">
          <div className="mono-label mb-3" style={{ color: 'var(--ink-faint)' }}>
            SOW Document
          </div>

          <div className="flex gap-1.5 mb-4 flex-wrap">
            <span className="badge-parchment" style={bg(st.v)}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C[st.v] || 'var(--ink-faint)' }} />
              {st.l}
            </span>
            <span className="badge-parchment" style={bg(sow.intakeMode === "ai_generated" ? "teal" : "beige")}>
              {sow.intakeMode === "ai_generated" ? <><Bot style={{ width: 10, height: 10 }} /> AI Generated</> : <><Upload style={{ width: 10, height: 10 }} /> Manual</>}
            </span>
            <span className="badge-parchment" style={bg(cCfg[sow.confidentiality] || "beige")}>
              <Shield style={{ width: 10, height: 10 }} /> {sow.confidentiality.charAt(0).toUpperCase() + sow.confidentiality.slice(1)}
            </span>
            {sow.riskScore.overall > 0 && (
              <span className="badge-parchment" style={bg(rv(sow.riskScore.overall))}>Risk {sow.riskScore.overall}/100</span>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                className="font-heading leading-[1.1]"
                style={{ fontSize: '2.2rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.03em', margin: 0 }}
              >
                {sow.title}
              </h1>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="mono-label" style={{ color: 'var(--ink-faint)' }}>{sow.id.toUpperCase()}</span>
                {[
                  sow.client,
                  `v${sow.version}`,
                  `${sow.pages} pages`,
                  ...(sow.estimatedBudget > 0 ? [`$${Math.round(sow.estimatedBudget / 1000)}k`] : []),
                  ...(sow.estimatedDuration && sow.estimatedDuration !== "TBD" ? [sow.estimatedDuration] : []),
                  `by ${sow.createdBy}`,
                ].map((t, i) => (
                  <React.Fragment key={i}>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-soft)' }} />
                    <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{t}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex gap-2 shrink-0 mt-1">
              {(sow.status === "draft" || sow.status === "review") && valid && (
                <button onClick={() => setShowModal(true)} style={btnPrimary}><Send style={{ width: 13, height: 13 }} /> Submit for Approval</button>
              )}
              {sow.status === "draft" && !valid && (
                <Link href={sow.intakeMode === "ai_generated" ? "/enterprise/sow/generate" : "/enterprise/sow/upload"}>
                  <button style={btnPrimary}><Sparkles style={{ width: 13, height: 13 }} /> Continue Setup</button>
                </Link>
              )}
              {sow.status === "approval" && (
                <Link href={`/enterprise/sow/${sow.id}/approve`}><button style={btnPrimary}><Clock style={{ width: 13, height: 13 }} /> View Approval</button></Link>
              )}
              {sow.status === "approved" && sow.planId && (
                <Link href={`/enterprise/decomposition/${sow.planId}`}><button style={btnPrimary}><ExternalLink style={{ width: 13, height: 13 }} /> View Plan</button></Link>
              )}
              {sow.status === "approved" && !sow.planId && (
                <Link href={`/enterprise/decomposition?sowId=${sow.id}`}><button style={btnPrimary}><Layers style={{ width: 13, height: 13 }} /> Start Decomposition</button></Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════
          TAB BAR — clean underline style
          ═══════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="flex gap-0 overflow-x-auto mb-7" style={{ borderBottom: '1px solid var(--border-hair)', scrollbarWidth: 'none' }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 shrink-0 transition-all"
                style={{
                  padding: '10px 16px',
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--ink)' : 'var(--ink-faint)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid #A67763' : '2px solid transparent',
                  cursor: 'pointer',
                  marginBottom: -1,
                  whiteSpace: 'nowrap',
                }}
              >
                <t.icon style={{ width: 12, height: 12 }} />
                {t.label}
                {t.id === "clauses" && prohib > 0 && (sow.status === "draft" || sow.status === "review") && (
                  <span className="flex items-center justify-center rounded-full" style={{ width: 16, height: 16, background: active ? 'rgba(166,119,99,0.12)' : 'rgba(166,119,99,0.08)', fontSize: 8, fontWeight: 700, color: '#A67763' }}>
                    {prohib}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════
           TAB: Overview
           ═══════════════════════════════════ */}
        {tab === "overview" && (
          <div className="grid gap-5" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
            {/* Left — SOW Details */}
            <div className="card-parchment">
              <div className="section-header-parchment">
                <div style={sectionTitle}>SOW Details</div>
              </div>
              <div style={{ padding: '8px 10px 10px' }}>
                {[
                  { icon: Calendar, l: "Created", v: fdt(sow.createdAt), c: "gold" },
                  { icon: Clock, l: "Last Updated", v: fdt(sow.updatedAt), c: "beige" },
                  ...(sow.approvedBy ? [{ icon: CheckCircle2, l: "Approved By", v: sow.approvedBy, c: "forest" }] : []),
                  ...(sow.slaCompliance ? [{ icon: Shield, l: "SLA Compliance", v: `${sow.slaCompliance}%`, c: "gold" }] : []),
                ].map((item, i, a) => {
                  const Ic = item.icon;
                  return (
                    <React.Fragment key={item.l}>
                      <div
                        className="flex items-center gap-3.5 rounded-xl transition-all"
                        style={{ padding: '11px 16px', border: '1px solid transparent' }}
                        onMouseEnter={hoverIn}
                        onMouseLeave={hoverOut}
                      >
                        <div className="flex items-center justify-center shrink-0" style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, rgba(${R[item.c]},0.12), rgba(${R[item.c]},0.04))`, border: `1px solid rgba(${R[item.c]},0.16)` }}>
                          <Ic className="w-3 h-3" style={{ color: C[item.c] }} />
                        </div>
                        <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-faint)' }}>{item.l}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{item.v}</span>
                      </div>
                      {i < a.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Right column — stacked cards */}
            <div className="flex flex-col gap-5">
              {/* Content Summary */}
              <div className="card-parchment">
                <div className="section-header-parchment">
                  <div style={sectionTitle}>Content Summary</div>
                </div>
                <div style={{ padding: '16px 22px 20px' }}>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { l: "Clauses", v: `${clauses.length}`, color: '#5B9BA2', bg: 'rgba(91,155,162,0.05)', border: 'rgba(91,155,162,0.12)' },
                      { l: "Prohibited", v: `${prohib}`, color: prohib > 0 ? '#A67763' : '#000000', bg: prohib > 0 ? 'rgba(166,119,99,0.06)' : 'rgba(77,87,65,0.05)', border: prohib > 0 ? 'rgba(166,119,99,0.14)' : 'rgba(77,87,65,0.12)' },
                    ].map((s) => (
                      <div key={s.l} className="text-center rounded-xl" style={{ padding: '14px 8px', background: s.bg, border: `1px solid ${s.border}` }}>
                        <div className="num-display" style={{ fontSize: '1.4rem', color: s.color }}>{s.v}</div>
                        <div style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, fontWeight: 500 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {sow.industry && (
                    <div className="flex items-center justify-between mb-4" style={{ fontSize: 12 }}>
                      <span style={{ color: 'var(--ink-faint)' }}>Industry</span>
                      <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{sow.industry}</span>
                    </div>
                  )}

                  {/* Stakeholders */}
                  <span className="label-caps" style={{ display: 'block', marginBottom: 10 }}>Stakeholders</span>
                  <div className="flex flex-wrap gap-2">
                    {sow.stakeholders.map((name) => (
                      <div key={name} className="flex items-center gap-2 rounded-lg" style={{ padding: '6px 12px', border: '1px solid var(--border-hair)', background: 'rgba(201,176,157,0.04)' }}>
                        <div className="flex items-center justify-center rounded-full" style={{ width: 22, height: 22, background: 'linear-gradient(135deg, rgba(166,119,99,0.14), rgba(166,119,99,0.06))', border: '1px solid rgba(166,119,99,0.15)' }}>
                          <User style={{ width: 10, height: 10, color: '#A67763' }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink)' }}>{name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <span className="label-caps" style={{ display: 'block', margin: '18px 0 8px' }}>Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sow.tags.map((tag) => (
                      <span key={tag} className="badge-parchment" style={bg("beige")}><Tag style={{ width: 9, height: 9 }} /> {tag}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
           TAB: Clauses
           ═══════════════════════════════════ */}
        {tab === "clauses" && (
          <div className="flex flex-col gap-5">
            {prohib > 0 && (
              <div className="card-parchment" style={{ borderColor: 'rgba(166,119,99,0.25)' }}>
                <div className="flex items-center gap-3.5" style={{ padding: '16px 22px' }}>
                  <div style={bx("brown", 36)}><Ban style={{ width: 15, height: 15, color: '#A67763' }} /></div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{prohib} Prohibited Clause{prohib > 1 ? "s" : ""} Detected</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 2 }}>Must be addressed before approval.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="card-parchment">
              <div className="section-header-parchment">
                <div className="flex items-center gap-2">
                  <span style={sectionTitle}>Tagged Clauses</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>({clauses.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={clFilter} onValueChange={setClFilter}>
                    <SelectTrigger className="h-8 text-xs w-[160px]"><Filter style={{ width: 12, height: 12, marginRight: 4, color: 'var(--ink-faint)' }} /><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types ({clauses.length})</SelectItem>
                      {Object.entries(clCounts).sort((a, b) => b[1] - a[1]).map(([t, n]) => (<SelectItem key={t} value={t}>{clCfg[t]?.l || t} ({n})</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--ink-faint)' }} />
                    <input type="text" value={clSearch} onChange={(e) => setClSearch(e.target.value)} placeholder="Search clauses..." style={searchInput} />
                  </div>
                </div>
              </div>

              {fClauses.length === 0 ? (
                <div className="text-center" style={{ padding: '48px 20px' }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>No clauses match your filters.</p>
                </div>
              ) : (
                <div style={{ padding: '8px 10px 10px' }}>
                  {fClauses.map((cl, i) => {
                    const typeV = clCfg[cl.type]?.v || "beige";
                    return (
                      <React.Fragment key={cl.id}>
                        <div
                          className="flex items-start gap-3.5 rounded-xl transition-all"
                          style={{ padding: '14px 16px', border: '1px solid transparent', ...(cl.isProhibited ? { background: 'rgba(166,119,99,0.02)' } : {}) }}
                          onMouseEnter={hoverIn}
                          onMouseLeave={hoverOut}
                        >
                          <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, rgba(${R[typeV]},0.14), rgba(${R[typeV]},0.05))`, border: `1px solid rgba(${R[typeV]},0.20)`, marginTop: 1 }}>
                            {cl.isProhibited ? <Ban className="w-3.5 h-3.5" style={{ color: '#A67763' }} /> : <Scale className="w-3.5 h-3.5" style={{ color: C[typeV] }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                              <span className="badge-parchment" style={bg(typeV)}>{clCfg[cl.type]?.l || cl.type}</span>
                              <span className="mono-label" style={{ color: 'var(--ink-faint)' }}>{cl.sectionRef}</span>
                              {cl.isProhibited && <span className="badge-parchment" style={bg("brown")}><Ban style={{ width: 8, height: 8 }} /> Prohibited</span>}
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{cl.text}</p>
                            {cl.isProhibited && cl.prohibitedReason && (
                              <div className="card-parchment" style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10 }}>
                                <p style={{ fontSize: 12, color: 'var(--ink-mid)' }}>{cl.prohibitedReason}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 mt-1">
                            <div className="prog-track" style={{ width: 36, height: 3 }}>
                              <div className="prog-fill" style={{ width: `${cl.confidence}%`, background: cg(cl.confidence) }} />
                            </div>
                            <span className="mono-label" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{cl.confidence}%</span>
                          </div>
                        </div>
                        {i < fClauses.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
           TAB: Document
           ═══════════════════════════════════ */}
        {tab === "document" && (
          <div className="card-parchment">
            <div className="section-header-parchment">
              <div className="flex items-center gap-2">
                <span style={sectionTitle}>{sow.intakeMode === "ai_generated" ? "Generated Document" : "Uploaded Document"}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>({sections.length} sections)</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--ink-faint)' }} />
                  <input type="text" value={docSearch} onChange={(e) => setDocSearch(e.target.value)} placeholder="Search document..." style={searchInput} />
                </div>
                <button style={btnOutline}><Download style={{ width: 13, height: 13 }} /> Download</button>
              </div>
            </div>

            {fDocs.length === 0 ? (
              <div className="text-center" style={{ padding: '48px 20px' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{sections.length === 0 ? "No sections parsed yet" : "No matching sections"}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{sections.length === 0 ? "Sections will appear once AI finishes parsing." : "Try different search terms."}</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end" style={{ padding: '12px 22px 0' }}>
                  <button onClick={() => { expanded.size === sections.length ? setExpanded(new Set()) : setExpanded(new Set(sections.map((s) => s.id))); }} className="link-gold">
                    {expanded.size === sections.length ? "Collapse all" : "Expand all"}
                  </button>
                </div>
                <div style={{ padding: '8px 10px 10px' }}>
                  {fDocs.map((sec, i) => {
                    const open = expanded.has(sec.id);
                    const idx = sections.findIndex((s) => s.id === sec.id);
                    return (
                      <React.Fragment key={sec.id}>
                        <div className="rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggle(sec.id)}
                            className="flex items-center gap-3.5 w-full text-left rounded-xl transition-all"
                            style={{ padding: '14px 16px', background: 'transparent', border: '1px solid transparent', cursor: 'pointer' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(166,119,99,0.04)'; e.currentTarget.style.borderColor = 'var(--border-hair)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'transparent'; }}
                          >
                            <div className="flex items-center justify-center shrink-0" style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, rgba(166,119,99,0.12), rgba(208,176,96,0.04))', border: '1px solid rgba(166,119,99,0.16)' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)' }}>{String(idx + 1).padStart(2, "0")}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.title}</p>
                              {!open && <p style={{ fontSize: 11, color: 'var(--ink-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{sec.content.substring(0, 80)}...</p>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="prog-track" style={{ width: 40, height: 3 }}><div className="prog-fill" style={{ width: `${sec.confidence}%`, background: cg(sec.confidence) }} /></div>
                              <span className="mono-label" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{sec.confidence}%</span>
                              {sec.aiSuggestion && <Sparkles style={{ width: 12, height: 12, color: '#D0B060' }} />}
                            </div>
                            {open ? <ChevronUp style={{ width: 14, height: 14, color: 'var(--ink-faint)' }} /> : <ChevronDown style={{ width: 14, height: 14, color: 'var(--ink-faint)' }} />}
                          </button>
                          {open && (
                            <div style={{ padding: '0 16px 16px 62px', borderTop: '1px solid var(--border-hair)' }}>
                              <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.7, marginTop: 14 }}>{sec.content}</p>
                              {sec.aiSuggestion && (
                                <div className="card-parchment" style={{ marginTop: 12, padding: 14, borderRadius: 12 }}>
                                  <p className="label-caps" style={{ color: '#86713D', marginBottom: 4 }}>AI Suggestion</p>
                                  <p style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{sec.aiSuggestion}</p>
                                  <div className="flex gap-2 mt-3">
                                    <button style={{ ...btnOutline, padding: '5px 12px', fontSize: 11, borderColor: 'rgba(77,87,65,0.15)', color: '#4D5741' }}><CheckCircle2 style={{ width: 11, height: 11 }} /> Accept</button>
                                    <button style={{ ...btnOutline, padding: '5px 12px', fontSize: 11 }}><X style={{ width: 11, height: 11 }} /> Dismiss</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {i < fDocs.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════
           TAB: AI Analysis
           ═══════════════════════════════════ */}
        {tab === "ai-risk" && (
          <div className="flex flex-col gap-5">
            {sow.intakeMode === "ai_generated" ? (
              <>
                {/* Generation Parameters */}
                {genParams && (
                  <div className="card-parchment">
                    <div className="section-header-parchment">
                      <div style={sectionTitle}>Generation Parameters</div>
                      <span className="badge-parchment" style={bg("teal")}><Bot style={{ width: 9, height: 9 }} /> AI Generated</span>
                    </div>
                    <div style={{ padding: '8px 10px 10px' }}>
                      {[
                        { icon: FileText, l: "Template", v: genParams.templateUsed, c: "brown" },
                        { icon: Tag, l: "Industry", v: genParams.industry, c: "teal" },
                        { icon: Layers, l: "Project Type", v: genParams.projectType, c: "gold" },
                        { icon: CheckCircle2, l: "Wizard Progress", v: `${genParams.wizardStepsCompleted}/${genParams.totalWizardSteps} steps`, c: "forest" },
                        { icon: Calendar, l: "Generated At", v: fdt(genParams.generatedAt), c: "beige" },
                        { icon: Clock, l: "Duration", v: genParams.generationDuration, c: "teal" },
                        { icon: ShieldCheck, l: "Guardrails Passed", v: `${genParams.guardrailsPassed}/${genParams.totalGuardrails}`, c: "forest" },
                      ].map((item, i, a) => {
                        const Ic = item.icon;
                        return (
                          <React.Fragment key={item.l}>
                            <div className="flex items-center gap-3.5 rounded-xl transition-all" style={{ padding: '11px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                              <div className="flex items-center justify-center shrink-0" style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, rgba(${R[item.c]},0.12), rgba(${R[item.c]},0.04))`, border: `1px solid rgba(${R[item.c]},0.16)` }}>
                                <Ic className="w-3 h-3" style={{ color: C[item.c] }} />
                              </div>
                              <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-faint)' }}>{item.l}</span>
                              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{item.v}</span>
                            </div>
                            {i < a.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Confidence Breakdown */}
                <div className="card-parchment">
                  <div className="section-header-parchment">
                    <div style={sectionTitle}>Confidence Breakdown</div>
                    <span className="badge-parchment" style={bg(cv(sow.aiConfidence))}>{sow.aiConfidence}%</span>
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <div className="flex items-center gap-4 mb-5">
                      <span className="num-display" style={{ fontSize: 36, color: C[cv(sow.aiConfidence)] }}>{sow.aiConfidence}%</span>
                      <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{sow.aiConfidence >= 90 ? "High confidence — all sections above threshold" : "Some sections need review"}</p>
                    </div>
                    {sections.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {sections.map((sec) => (
                          <div key={sec.id} className="flex items-center gap-2.5">
                            <span style={{ fontSize: 11, color: 'var(--ink-muted)', width: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.title}</span>
                            <div className="prog-track" style={{ flex: 1, height: 4 }}><div className="prog-fill" style={{ width: `${sec.confidence}%`, background: cg(sec.confidence) }} /></div>
                            <span className="mono-label" style={{ fontSize: 9, color: 'var(--ink-faint)', width: 24, textAlign: 'right' }}>{sec.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Layers */}
                {hallucinationLayers.length > 0 && (
                  <div className="card-parchment">
                    <div className="section-header-parchment">
                      <div style={sectionTitle}>AI Verification Layers</div>
                      <div className="flex items-center gap-2">
                        {hallucinationLayers.some((l) => l.status === "failed") ? (
                          <span className="badge-parchment" style={bg("brown")}><X style={{ width: 9, height: 9 }} /> Issues</span>
                        ) : hallucinationLayers.some((l) => l.status === "warning") ? (
                          <span className="badge-parchment" style={bg("gold")}><AlertTriangle style={{ width: 9, height: 9 }} /> Warnings</span>
                        ) : (
                          <span className="badge-parchment" style={bg("forest")}><CheckCircle2 style={{ width: 9, height: 9 }} /> All Clear</span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{hallucinationLayers.filter((l) => l.status === "passed").length}/{hallucinationLayers.length}</span>
                      </div>
                    </div>
                    <div style={{ padding: '8px 10px 10px' }}>
                      {hallucinationLayers.map((layer, i) => {
                        const sc = { passed: { v: "forest", icon: CheckCircle2, l: "Passed" }, warning: { v: "gold", icon: AlertTriangle, l: "Warning" }, failed: { v: "brown", icon: X, l: "Failed" }, skipped: { v: "beige", icon: Clock, l: "Skipped" } }[layer.status];
                        const LI = sc.icon;
                        return (
                          <React.Fragment key={layer.layer}>
                            <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '14px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                              <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, rgba(${R[sc.v]},0.14), rgba(${R[sc.v]},0.05))`, border: `1px solid rgba(${R[sc.v]},0.20)` }}>
                                <LI className="w-3.5 h-3.5" style={{ color: C[sc.v] }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="mono-label" style={{ color: 'var(--ink-faint)' }}>L{layer.layer}</span>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{layer.name}</span>
                                  <span className="badge-parchment" style={bg(sc.v)}>{sc.l}</span>
                                </div>
                                <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{layer.description}</p>
                                <p style={{ fontSize: 12, color: 'var(--ink-mid)', marginTop: 2 }}>{layer.details}</p>
                              </div>
                            </div>
                            {i < hallucinationLayers.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {sow.hallucinationFlags && sow.hallucinationFlags.length > 0 && (
                  <div className="card-parchment">
                    <div className="section-header-parchment">
                      <div style={sectionTitle}>Red-Flag Detections</div>
                      <span className="badge-parchment" style={bg("brown")}>{sow.hallucinationFlags.length} flags</span>
                    </div>
                    <div style={{ padding: '8px 10px 10px' }}>
                      {sow.hallucinationFlags.map((f, i) => (
                        <React.Fragment key={f.id}>
                          <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '14px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                            <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, ...bx(f.resolved ? "forest" : f.severity === "high" ? "brown" : "gold", 34) }}>
                              <AlertTriangle className="w-3.5 h-3.5" style={{ color: C[f.resolved ? "forest" : f.severity === "high" ? "brown" : "gold"] }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="badge-parchment" style={bg(f.severity === "high" ? "brown" : "gold")}>{f.severity}</span>
                                {f.resolved && <span className="badge-parchment" style={bg("forest")}>Resolved</span>}
                              </div>
                              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>&ldquo;{f.clause}&rdquo;</p>
                              <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 3 }}>{f.reason}</p>
                              <p style={{ fontSize: 12, color: '#5B9BA2', marginTop: 3 }}>Suggestion: {f.suggestion}</p>
                            </div>
                          </div>
                          {i < sow.hallucinationFlags!.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Completeness Score */}
                <div className="card-parchment">
                  <div className="section-header-parchment">
                    <div style={sectionTitle}>Completeness Score</div>
                    <span className="badge-parchment" style={bg(cv(sow.gapAnalysisScore || 0))}>{sow.gapAnalysisScore || "—"}%</span>
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="num-display" style={{ fontSize: 36, color: C[cv(sow.gapAnalysisScore || 0)] }}>{sow.gapAnalysisScore || "—"}%</span>
                      <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Minimum recommended: 80%</p>
                    </div>
                    <div className="prog-track" style={{ height: 6 }}><div className="prog-fill" style={{ width: `${sow.gapAnalysisScore || 0}%`, background: cg(sow.gapAnalysisScore || 0) }} /></div>
                  </div>
                </div>

                {/* Gap Analysis */}
                <div className="card-parchment">
                  <div className="section-header-parchment">
                    <div style={sectionTitle}>Gap Analysis</div>
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 14 }}>Comparison against platform SOW standard template.</p>
                    {sections.length > 0 ? sections.map((sec) => (
                      <div key={sec.id} className="flex items-center gap-2.5 mb-2">
                        <span style={{ fontSize: 11, color: 'var(--ink-muted)', width: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.title}</span>
                        <div className="prog-track" style={{ flex: 1, height: 4 }}><div className="prog-fill" style={{ width: `${sec.confidence}%`, background: cg(sec.confidence) }} /></div>
                        <span className="mono-label" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{sec.confidence}%</span>
                      </div>
                    )) : <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>No sections parsed yet.</p>}
                  </div>
                </div>

                {/* Red Flags for uploaded */}
                {sow.hallucinationFlags && sow.hallucinationFlags.length > 0 && (
                  <div className="card-parchment">
                    <div className="section-header-parchment">
                      <div style={sectionTitle}>Red-Flag Detections</div>
                    </div>
                    <div style={{ padding: '8px 10px 10px' }}>
                      {sow.hallucinationFlags.map((f, i) => (
                        <React.Fragment key={f.id}>
                          <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '14px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                            <div style={bx(f.severity === "high" ? "brown" : "gold", 34)}>
                              <AlertTriangle className="w-3.5 h-3.5" style={{ color: C[f.severity === "high" ? "brown" : "gold"] }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <span className="badge-parchment" style={bg(f.severity === "high" ? "brown" : "gold")}>{f.severity}</span>
                              <p style={{ fontSize: 13, color: 'var(--ink)', marginTop: 6 }}>&ldquo;{f.clause}&rdquo;</p>
                              <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 3 }}>{f.reason}</p>
                            </div>
                          </div>
                          {i < sow.hallucinationFlags!.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {/* ── Risk & Compliance ── */}

            {/* Risk Breakdown */}
            {sow.riskScore.overall > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { l: "Completeness", v: sow.riskScore.completeness, m: 30, w: "30%", c: "brown" },
                  { l: "Confidence", v: sow.riskScore.confidence, m: 25, w: "25%", c: "teal" },
                  { l: "Compliance", v: sow.riskScore.compliance, m: 25, w: "25%", c: "gold" },
                  { l: "Pattern Match", v: sow.riskScore.patternMatch, m: 20, w: "20%", c: "forest" },
                ].map((item) => (
                  <div key={item.l} className="card-parchment" style={{ padding: '20px 22px' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)' }}>{item.l}</span>
                      <span className="label-caps">{item.w}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="num-display" style={{ fontSize: 24, color: 'var(--ink)' }}>{item.v}</span>
                      <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>/{item.m}</span>
                    </div>
                    <div className="prog-track" style={{ height: 4 }}><div className="prog-fill" style={{ width: `${(item.v / item.m) * 100}%`, background: cg((item.v / item.m) * 100) }} /></div>
                  </div>
                ))}
              </div>
            )}

            {/* Ethics Screening */}
            <div className="card-parchment">
              <div className="section-header-parchment">
                <div style={sectionTitle}>Ethics Screening</div>
                {ethicsScreening.length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{ethicsScreening.filter((e) => e.status === "pass").length}/{ethicsScreening.length} passed</span>
                )}
              </div>
              {ethicsScreening.length > 0 ? (
                <div style={{ padding: '8px 10px 10px' }}>
                  {ethicsScreening.map((item, i) => {
                    const sm = { pass: { v: "forest", icon: CheckCircle2, l: "Pass" }, fail: { v: "brown", icon: X, l: "Fail" }, warning: { v: "gold", icon: AlertTriangle, l: "Warning" }, not_applicable: { v: "beige", icon: Clock, l: "N/A" } }[item.status];
                    const SI = sm.icon;
                    return (
                      <React.Fragment key={item.id}>
                        <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '12px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                          <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, rgba(${R[sm.v]},0.14), rgba(${R[sm.v]},0.05))`, border: `1px solid rgba(${R[sm.v]},0.20)` }}>
                            <SI className="w-3.5 h-3.5" style={{ color: C[sm.v] }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-1.5">
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.criterion}</span>
                              <span className="badge-parchment" style={bg(sm.v)}>{sm.l}</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 2 }}>{item.details}</p>
                          </div>
                        </div>
                        {i < ethicsScreening.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '32px 20px' }}>
                  <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>No ethics screening data.</p>
                </div>
              )}
            </div>

            {/* Data Sensitivity */}
            <div className="card-parchment">
              <div className="section-header-parchment">
                <div style={sectionTitle}>Data Sensitivity</div>
                <span className="badge-parchment" style={bg(cCfg[sow.dataSensitivity] || "beige")}>{sow.dataSensitivity}</span>
              </div>
              <div style={{ padding: '8px 10px 10px' }}>
                {sensitivityReqs.map((req, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-3.5 rounded-xl transition-all" style={{ padding: '10px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                      <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, rgba(77,87,65,0.12), rgba(77,87,65,0.04))', border: '1px solid rgba(77,87,65,0.16)' }}>
                        <CheckCircle2 className="w-3 h-3" style={{ color: '#4D5741' }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--ink-mid)' }}>{req}</span>
                    </div>
                    {i < sensitivityReqs.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Regulatory Alignment */}
            <div className="card-parchment">
              <div className="section-header-parchment">
                <div style={sectionTitle}>Regulatory Alignment</div>
              </div>
              {regulatoryItems.length > 0 ? (
                <div style={{ padding: '8px 10px 10px' }}>
                  {regulatoryItems.map((item, i) => {
                    const sm = { compliant: { v: "forest", l: "Compliant" }, non_compliant: { v: "brown", l: "Non-Compliant" }, partial: { v: "gold", l: "Partial" }, not_assessed: { v: "beige", l: "Not Assessed" } }[item.status];
                    return (
                      <React.Fragment key={item.id}>
                        <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '12px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                          <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, rgba(${R[sm.v]},0.14), rgba(${R[sm.v]},0.05))`, border: `1px solid rgba(${R[sm.v]},0.20)` }}>
                            <ShieldCheck className="w-3.5 h-3.5" style={{ color: C[sm.v] }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.regulation}</span>
                              <span className="badge-parchment" style={bg(sm.v)}>{sm.l}</span>
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{item.description}</p>
                            <p style={{ fontSize: 12, color: 'var(--ink-mid)', marginTop: 2 }}>{item.notes}</p>
                          </div>
                        </div>
                        {i < regulatoryItems.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '32px 20px' }}>
                  <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>No regulatory data.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
           TAB: Approval
           ═══════════════════════════════════ */}
        {tab === "history" && (
          <div className="flex flex-col gap-5">
            {/* Pipeline visualization */}
            <div className="card-parchment">
              <div className="section-header-parchment">
                <div style={sectionTitle}>Approval Pipeline</div>
              </div>
              <div style={{ padding: '28px 26px 24px' }}>
                <div className="flex items-center justify-center gap-0">
                  {sow.approvalStages.map((stage, i) => {
                    const sv = stage.status === "approved" ? "forest" : stage.status === "in_review" ? "gold" : stage.status === "rejected" ? "brown" : "beige";
                    const stageCount = stage.status === "approved" ? 1 : stage.status === "in_review" ? 1 : 0;
                    const StgIcon = stage.status === "approved" ? CheckCircle2 : stage.status === "in_review" ? Clock : stage.status === "rejected" ? X : FileText;
                    return (
                      <React.Fragment key={stage.stage}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3.5 rounded-xl" style={{ padding: '14px 18px', background: stageCount > 0 ? `rgba(${R[sv]},0.06)` : 'rgba(166,119,99,0.03)', border: `1px solid ${stageCount > 0 ? `rgba(${R[sv]},0.18)` : 'var(--border-hair)'}` }}>
                            <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, borderRadius: 10, background: stageCount > 0 ? `linear-gradient(135deg, rgba(${R[sv]},0.14), rgba(${R[sv]},0.05))` : 'rgba(166,119,99,0.05)', border: `1px solid ${stageCount > 0 ? `rgba(${R[sv]},0.20)` : 'rgba(166,119,99,0.10)'}` }}>
                              <StgIcon className="w-4 h-4" style={{ color: stageCount > 0 ? C[sv] : 'var(--ink-faint)' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: stageCount > 0 ? 'var(--ink)' : 'var(--ink-faint)', textTransform: 'capitalize' }}>{stage.stage}</div>
                              <span className="badge-parchment" style={{ ...bg(sv), marginTop: 3 }}>
                                {stage.status === "approved" ? "Approved" : stage.status === "in_review" ? "In Review" : stage.status === "rejected" ? "Rejected" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {i < sow.approvalStages.length - 1 && (
                          <div className="flex items-center shrink-0 px-2">
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--ink-faint)', opacity: 0.4 }} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stage detail cards */}
            {sow.approvalStages.filter((s) => s.reviewer || s.comments).length > 0 && (
              <div className="card-parchment">
                <div className="section-header-parchment">
                  <div style={sectionTitle}>Review Details</div>
                </div>
                <div style={{ padding: '8px 10px 10px' }}>
                  {sow.approvalStages.filter((s) => s.reviewer || s.comments).map((stage, i, arr) => {
                    const sv = stage.status === "approved" ? "forest" : stage.status === "in_review" ? "gold" : stage.status === "rejected" ? "brown" : "beige";
                    const StgIcon = stage.status === "approved" ? CheckCircle2 : stage.status === "in_review" ? Clock : X;
                    return (
                      <React.Fragment key={stage.stage}>
                        <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '14px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                          <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, rgba(${R[sv]},0.14), rgba(${R[sv]},0.05))`, border: `1px solid rgba(${R[sv]},0.20)` }}>
                            <StgIcon className="w-3.5 h-3.5" style={{ color: C[sv] }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', textTransform: 'capitalize' }}>{stage.stage} Review</span>
                              <span className="badge-parchment" style={bg(sv)}>{stage.status === "approved" ? "Approved" : stage.status === "in_review" ? "In Review" : "Pending"}</span>
                            </div>
                            {stage.reviewer && <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Reviewer: <span style={{ color: 'var(--ink-mid)', fontWeight: 500 }}>{stage.reviewer}</span></p>}
                            {stage.reviewedAt && <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>{fdt(stage.reviewedAt)}</p>}
                            {stage.comments && <p style={{ fontSize: 12, color: 'var(--ink-mid)', fontStyle: 'italic', marginTop: 6 }}>&ldquo;{stage.comments}&rdquo;</p>}
                          </div>
                        </div>
                        {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Version History ── */}
            <div className="card-parchment">
            <div className="section-header-parchment">
              <div style={sectionTitle}>Version History</div>
              <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{versions.length} version{versions.length > 1 ? "s" : ""}</span>
            </div>
            <div style={{ padding: '16px 22px 20px', position: 'relative', paddingLeft: 48 }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', left: 33, top: 20, bottom: 20, width: 2, background: 'var(--border-soft)' }} />

              {versions.map((ver, i) => (
                <div key={ver.version} style={{ position: 'relative', paddingBottom: i < versions.length - 1 ? 24 : 0 }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: -27, top: 4,
                    width: 24, height: 24, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                    fontSize: 9, fontWeight: 700,
                    ...(i === 0
                      ? { background: 'linear-gradient(135deg, #A67763, #886151)', color: '#FFFFFF', boxShadow: '0 0 0 3px rgba(166,119,99,0.12)' }
                      : { background: 'var(--page-bg)', border: '2px solid var(--border-soft)', color: 'var(--ink-faint)' }
                    ),
                  }}>
                    v{ver.version}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Version {ver.version}</span>
                      {i === 0 && <span className="badge-parchment" style={bg("brown")}>Current</span>}
                      <span className="badge-parchment" style={bg(ver.status === "approved" ? "forest" : "beige")}>{ver.status === "approved" ? "Approved" : "Draft"}</span>
                      <span className="badge-parchment" style={bg(ver.intakeMode === "ai_generated" ? "teal" : "beige")}>{ver.intakeMode === "ai_generated" ? "AI" : "Upload"}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1.5 }}>{ver.changes}</p>
                    <div className="flex items-center gap-2 mt-1.5" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                      <User style={{ width: 10, height: 10 }} /> {ver.changedBy}
                      <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--border-soft)' }} />
                      <Calendar style={{ width: 10, height: 10 }} /> {fdt(ver.date)}
                      {i !== 0 && <Link href={`/enterprise/sow/${sow.id}/compare`} className="link-gold" onClick={(e) => e.stopPropagation()}>Compare</Link>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

            {/* ── Audit Trail ── */}
            <div className="card-parchment">
            <div className="section-header-parchment">
              <div style={sectionTitle}>Audit Trail</div>
              <div className="flex items-center gap-2">
                <Select value={auFilter} onValueChange={setAuFilter}>
                  <SelectTrigger className="h-8 text-xs w-[140px]"><Filter style={{ width: 12, height: 12, marginRight: 4, color: 'var(--ink-faint)' }} /><SelectValue placeholder="All Events" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="parsed">Parsed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
                <button style={btnOutline}><Download style={{ width: 13, height: 13 }} /> Export</button>
              </div>
            </div>

            {fAudit.length === 0 ? (
              <div className="text-center" style={{ padding: '48px 20px' }}>
                <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>No events match your filter.</p>
              </div>
            ) : (
              <div style={{ padding: '8px 10px 10px' }}>
                {fAudit.map((ev, i) => {
                  const ac = auCfg[ev.action] || auCfg.updated;
                  const AI = ac.icon;
                  return (
                    <React.Fragment key={ev.id}>
                      <div className="flex items-start gap-3.5 rounded-xl transition-all" style={{ padding: '14px 16px', border: '1px solid transparent' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                        <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, rgba(${R[ac.v]},0.14), rgba(${R[ac.v]},0.05))`, border: `1px solid rgba(${R[ac.v]},0.20)` }}>
                          <AI className="w-3.5 h-3.5" style={{ color: C[ac.v] }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{ev.actor}</span>
                            <span className="badge-parchment" style={bg(ac.v)}>{ev.action.charAt(0).toUpperCase() + ev.action.slice(1)}</span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1.5 }}>{ev.details}</p>
                          <p style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 3, opacity: 0.7 }}>{fdt(ev.timestamp)}</p>
                        </div>
                      </div>
                      {i < fAudit.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            </div>

            {/* ── Linked Resources ── */}
            {sow.planId ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Link href={`/enterprise/decomposition/${sow.planId}`} style={{ textDecoration: 'none' }}>
                  <div className="card-parchment" style={{ padding: 24, cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(208,176,96,0.30)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                  >
                    <div className="flex items-start gap-3.5">
                      <div style={bx("teal", 42)}><GitBranch style={{ width: 18, height: 18, color: '#5B9BA2' }} /></div>
                      <div style={{ flex: 1 }}>
                        <p className="label-caps" style={{ marginBottom: 4 }}>Decomposition Plan</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{sow.title} — Plan</p>
                        <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>Plan ID: {sow.planId}</p>
                      </div>
                      <ExternalLink style={{ width: 14, height: 14, color: 'var(--ink-faint)' }} />
                    </div>
                  </div>
                </Link>
                {linkedProject ? (
                  <Link href={`/enterprise/projects/${linkedProject.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card-parchment" style={{ padding: 24, cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(208,176,96,0.30)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                    >
                      <div className="flex items-start gap-3.5">
                        <div style={bx("forest", 42)}><ClipboardList style={{ width: 18, height: 18, color: '#4D5741' }} /></div>
                        <div style={{ flex: 1 }}>
                          <p className="label-caps" style={{ marginBottom: 4 }}>Active Project</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{linkedProject.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>Client: {linkedProject.client}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Progress:</span>
                            <span className="badge-parchment" style={bg(linkedProject.health === "on_track" ? "forest" : "gold")}>{linkedProject.progress}%</span>
                          </div>
                        </div>
                        <ExternalLink style={{ width: 14, height: 14, color: 'var(--ink-faint)' }} />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="card-parchment" style={{ padding: 24 }}>
                    <div className="flex items-start gap-3.5">
                      <div style={bx("beige", 42)}><ClipboardList style={{ width: 18, height: 18, color: 'var(--ink-faint)' }} /></div>
                      <div>
                        <p className="label-caps" style={{ marginBottom: 4 }}>Project</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>No project created yet</p>
                        <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>Created once plan is approved and team assigned.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-parchment text-center" style={{ padding: '48px 20px' }}>
                <div style={{ ...bx("beige", 44), margin: '0 auto 14px' }}><Link2 style={{ width: 20, height: 20, color: 'var(--ink-faint)' }} /></div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>No linked resources yet</p>
                <p style={{ fontSize: 12, color: 'var(--ink-faint)', maxWidth: 320, margin: '0 auto' }}>Once this SOW is approved and decomposed, linked plans and projects will appear here.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ═══════════════════════════════════
         MODAL
         ═══════════════════════════════════ */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(77,55,46,0.18)', backdropFilter: 'blur(6px)' }} onClick={() => !submitted && setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-parchment" style={{ position: 'relative', width: '100%', maxWidth: 460, margin: '0 16px', padding: 28 }}>
            {!submitted ? (
              <>
                <div className="flex items-start gap-3.5 mb-6">
                  <div style={bx("brown", 40)}><Send style={{ width: 18, height: 18, color: '#A67763' }} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Submit SOW for Approval?</h3>
                    <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 4 }}>This will send the SOW through the 4-stage approval pipeline.</p>
                  </div>
                </div>

                <div className="card-parchment" style={{ marginBottom: 20, borderRadius: 14 }}>
                  <div style={{ padding: '8px 10px' }}>
                    {[
                      { l: "Title", v: sow.title },
                      { l: "Risk Score", v: `${sow.riskScore.overall}/100` },
                      { l: "Completeness", v: sow.gapAnalysisScore ? `${sow.gapAnalysisScore}%` : `${sow.parsedSections}/${sow.totalSections} sections` },
                      { l: "Timeline", v: sow.estimatedDuration },
                    ].map((item, i, a) => (
                      <React.Fragment key={item.l}>
                        <div className="flex justify-between" style={{ padding: '10px 16px' }}>
                          <span className="label-caps">{item.l}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{item.v}</span>
                        </div>
                        {i < a.length - 1 && <div style={{ height: 1, background: 'var(--border-hair)', margin: '0 8px' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <span className="label-caps" style={{ display: 'block', marginBottom: 10 }}>Approval Stages</span>
                  <div className="flex items-center gap-1.5">
                    {["Business", "Legal", "Security", "Final"].map((s, i) => (
                      <React.Fragment key={s}>
                        <div className="flex items-center gap-1.5 rounded-lg" style={{ padding: '5px 10px', border: '1px solid var(--border-hair)', background: 'rgba(201,176,157,0.04)' }}>
                          <span className="flex items-center justify-center rounded-full" style={{ width: 14, height: 14, background: 'rgba(201,176,157,0.15)', fontSize: 8, fontWeight: 700, color: 'var(--ink-faint)' }}>{i + 1}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-mid)' }}>{s}</span>
                        </div>
                        {i < 3 && <div style={{ width: 12, height: 1, background: 'var(--border-soft)' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} style={btnOutline}>Cancel</button>
                  <button onClick={confirm} style={btnPrimary}><Send style={{ width: 13, height: 13 }} /> Confirm Submission</button>
                </div>
              </>
            ) : (
              <div className="text-center" style={{ padding: '16px 0' }}>
                <div style={{ ...bx("forest", 48), margin: '0 auto 14px' }}><CheckCircle2 style={{ width: 22, height: 22, color: '#4D5741' }} /></div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>SOW Submitted Successfully</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Sent to Stage 1: Business Owner Review.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
