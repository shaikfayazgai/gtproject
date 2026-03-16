"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Shield,
  ShieldCheck,
  DollarSign,
  Clock,
  Users,
  Sparkles,
  Lock,
  ScrollText,
  GitBranch,
  Target,
  Scale,
  XCircle,
  Send,
  Gauge,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Checkbox, Textarea } from "@/components/ui";
import { mockSOWs } from "@/mocks/data/enterprise-sow";
import type { ApprovalStage } from "@/types/enterprise";

/* ═══ Theme helpers ═══ */

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

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600,
  background: "linear-gradient(135deg, #A67763, #886151)",
  border: "1px solid rgba(166,119,99,0.30)", color: "#FFFFFF",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(166,119,99,0.20)",
  cursor: "pointer", transition: "all 0.15s",
};

const btnOutline: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
  padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
  background: "transparent", border: "1px solid var(--border-soft)",
  color: "var(--ink-mid)", cursor: "pointer", transition: "all 0.15s",
};

/* ═══ Stage data ═══ */

const stageLabels: Record<string, string> = {
  business: "Business Owner", legal: "Legal / Compliance", security: "Security Review", final: "Final Sign-off",
};
const stageDesc: Record<string, string> = {
  business: "Verify budget, scope, and business alignment with strategic goals",
  legal: "Review contractual terms, IP rights, and regulatory compliance",
  security: "Assess data sensitivity classification and security requirements",
  final: "Executive sign-off for project initiation",
};
const stageIcons: Record<string, LucideIcon> = {
  business: DollarSign, legal: Scale, security: Shield, final: ShieldCheck,
};

interface CLI { id: string; label: string; description: string; icon: LucideIcon; }

const stageChecklists: Record<ApprovalStage, CLI[]> = {
  business: [
    { id: "scope-align", label: "Scope aligns with business objectives", description: "SOW deliverables match the strategic goals for this quarter", icon: Target },
    { id: "budget-ok", label: "Budget within procurement limits", description: "Estimated cost falls within approved spending authority", icon: DollarSign },
    { id: "timeline-ok", label: "Timeline is feasible", description: "Milestone dates are realistic given resource availability", icon: Clock },
    { id: "stakeholders", label: "Stakeholders identified and notified", description: "All key decision-makers are listed and aware", icon: Users },
  ],
  legal: [
    { id: "ip-rights", label: "IP rights and ownership clauses reviewed", description: "Intellectual property terms are clear and acceptable", icon: Shield },
    { id: "liability", label: "Liability and indemnification verified", description: "Risk allocation between parties is balanced", icon: Scale },
    { id: "compliance", label: "Regulatory compliance confirmed", description: "SOW meets all applicable industry regulations", icon: ShieldCheck },
    { id: "terms", label: "Standard terms applied", description: "Contractual terms match approved templates", icon: FileText },
  ],
  security: [
    { id: "data-class", label: "Data classification appropriate", description: "Sensitivity level matches the data types involved", icon: Shield },
    { id: "access-ctrl", label: "Access controls specified", description: "Authentication and authorization requirements are defined", icon: Lock },
    { id: "encryption", label: "Encryption requirements met", description: "Data at rest and in transit protection standards", icon: ShieldCheck },
    { id: "audit-trail", label: "Audit logging requirements defined", description: "Compliance monitoring and traceability mechanisms", icon: ScrollText },
  ],
  final: [
    { id: "all-stages", label: "All prior stages approved", description: "Business, Legal, and Security reviews are complete", icon: CheckCircle2 },
    { id: "risk-accept", label: "Residual risks accepted", description: "Outstanding risks documented with mitigation plans", icon: AlertTriangle },
    { id: "decomp-ready", label: "Ready for decomposition", description: "SOW is complete and can be broken into tasks", icon: GitBranch },
  ],
};

function riskLabel(s: number) { return s <= 25 ? "Low" : s <= 50 ? "Medium" : s <= 75 ? "High" : "Critical"; }
type RejectionType = "changes" | "reject";

const sCfg: Record<string, { v: string; l: string }> = {
  draft: { v: "beige", l: "Draft" }, parsing: { v: "teal", l: "Parsing" }, review: { v: "teal", l: "In Review" },
  approval: { v: "gold", l: "In Approval" }, approved: { v: "forest", l: "Approved" }, archived: { v: "beige", l: "Archived" },
  rejected: { v: "brown", l: "Rejected" }, changes_requested: { v: "gold", l: "Changes Requested" },
};

/* ═══════════════════════════════════════════════════════════════ */

export default function SOWApprovePage() {
  const params = useParams();
  const sowId = params.sowId as string;
  const sow = mockSOWs.find((s) => s.id === sowId) || mockSOWs[0];

  const activeStageIndex = sow.approvalStages.findIndex((s) => s.status === "in_review" || s.status === "pending");
  const activeStage = activeStageIndex >= 0 ? sow.approvalStages[activeStageIndex] : null;
  const activeChecklist = activeStage ? stageChecklists[activeStage.stage] : [];

  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [comments, setComments] = React.useState("");
  const allChecked = activeChecklist.every((item) => checked[item.id]);
  const checkedCount = activeChecklist.filter((item) => checked[item.id]).length;

  const [showRejectForm, setShowRejectForm] = React.useState(false);
  const [rejectionType, setRejectionType] = React.useState<RejectionType>("changes");
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [rejectionSubmitted, setRejectionSubmitted] = React.useState(false);
  const [approvalSubmitted, setApprovalSubmitted] = React.useState(false);

  const riskScore = sow.riskScore.overall;
  const rv = riskScore <= 25 ? "forest" : riskScore <= 50 ? "gold" : "brown";
  const allStagesApproved = sow.approvalStages.every((s) => s.status === "approved");
  const st = sCfg[sow.status] || sCfg.draft;

  const handleRejectSubmit = () => { if (!rejectionReason.trim()) return; setRejectionSubmitted(true); setShowRejectForm(false); };
  const handleApproveSubmit = () => { setApprovalSubmitted(true); };

  const showMain = activeStage && !approvalSubmitted && !rejectionSubmitted;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ── Hero ── */}
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          {sow.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {[sow.client, `v${sow.version}`, `${sow.pages} pg`].map((t, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-soft)" }} />}
              <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{t}</span>
            </React.Fragment>
          ))}
          <span style={{ ...bg(st.v), fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5 }}>{st.l}</span>
          <span style={{ ...bg(rv), fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5 }}>
            <Gauge style={{ width: 9, height: 9 }} /> {riskLabel(riskScore)} {riskScore}
          </span>
        </div>
      </motion.div>

      {showMain && (
        <>
          {/* ═══ HORIZONTAL TIMELINE ═══ */}
          <motion.div variants={fadeUp} className="card-parchment" style={{ padding: "24px 32px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {sow.approvalStages.map((stage, idx) => {
                const isActive = activeStage?.stage === stage.stage;
                const done = stage.status === "approved";
                const rejected = stage.status === "rejected";
                const isLast = idx === sow.approvalStages.length - 1;
                const StageIcon = stageIcons[stage.stage] || FileText;
                const d = stage.reviewedAt ? new Date(stage.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null;

                return (
                  <React.Fragment key={stage.stage}>
                    {/* Stage node */}
                    <div style={{
                      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      position: "relative",
                    }}>
                      {/* Circle */}
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: done
                          ? `linear-gradient(135deg, rgba(${R.forest},0.18), rgba(${R.forest},0.08))`
                          : isActive
                            ? `linear-gradient(135deg, rgba(${R.gold},0.18), rgba(${R.gold},0.08))`
                            : "rgba(255,255,255,0.8)",
                        border: `2px solid ${done ? `rgba(${R.forest},0.40)` : isActive ? `rgba(${R.gold},0.50)` : "var(--border-soft)"}`,
                        boxShadow: isActive
                          ? `0 0 0 5px rgba(${R.gold},0.10), 0 2px 8px rgba(${R.gold},0.12)`
                          : done
                            ? `0 2px 6px rgba(${R.forest},0.10)`
                            : "none",
                        transition: "all 0.3s",
                      }}>
                        {done ? <CheckCircle2 style={{ width: 18, height: 18, color: C.forest }} />
                          : rejected ? <XCircle style={{ width: 18, height: 18, color: C.brown }} />
                          : <StageIcon style={{ width: 17, height: 17, color: isActive ? C.gold : "var(--ink-faint)" }} />}
                      </div>

                      {/* Label block */}
                      <div style={{ textAlign: "center" }}>
                        <p style={{
                          fontSize: 11.5, fontWeight: 600, lineHeight: 1.25,
                          color: isActive ? C.gold : done ? C.forest : "var(--ink-muted)",
                        }}>
                          {stageLabels[stage.stage]}
                        </p>
                        {stage.reviewer && (
                          <p style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 2 }}>{stage.reviewer}</p>
                        )}
                        {done && d && (
                          <p style={{ fontSize: 9, color: "var(--ink-faint)", marginTop: 1, fontFamily: "var(--font-mono, monospace)" }}>{d}</p>
                        )}
                        {isActive && (
                          <span style={{
                            display: "inline-block", marginTop: 5,
                            fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                            background: `rgba(${R.gold},0.12)`, color: C.gold, border: `1px solid rgba(${R.gold},0.25)`,
                          }}>IN REVIEW</span>
                        )}
                      </div>
                    </div>

                    {/* Connector line */}
                    {!isLast && (
                      <div style={{
                        width: 48, height: 2, flexShrink: 0, borderRadius: 1, alignSelf: "flex-start", marginTop: 19,
                        background: done ? `rgba(${R.forest},0.30)` : "var(--border-hair)",
                        transition: "background 0.3s",
                      }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>

          {/* ═══ REVIEW CARD — Linear flow: checklist → notes → action ═══ */}
          <motion.div variants={fadeUp} className="card-parchment" style={{ padding: 0, overflow: "hidden" }}>
            {/* Card header */}
            <div className="section-header-parchment">
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>
                  {stageLabels[activeStage.stage]}
                </p>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>
                  {stageDesc[activeStage.stage]}
                </p>
              </div>
              <span style={{ ...bg(checkedCount === activeChecklist.length ? "forest" : "gold"), fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 5 }}>
                {checkedCount}/{activeChecklist.length}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ padding: "0 28px" }}>
              <div className="prog-track" style={{ marginTop: 20, marginBottom: 4 }}>
                <div className="prog-fill" style={{
                  width: `${activeChecklist.length > 0 ? (checkedCount / activeChecklist.length) * 100 : 0}%`,
                  transition: "width 0.4s ease-out",
                  background: allChecked
                    ? `linear-gradient(90deg, ${C.forest}, rgba(${R.teal},0.8))`
                    : `linear-gradient(90deg, ${C.brown}, rgba(${R.gold},0.7))`,
                }} />
              </div>
            </div>

            {/* Checklist — single column, linear flow */}
            <div style={{ padding: "16px 28px 0" }}>
              {activeChecklist.map((item, idx) => {
                const isChecked = !!checked[item.id];
                return (
                  <label
                    key={item.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 0", cursor: "pointer",
                      borderBottom: idx < activeChecklist.length - 1 ? "1px solid var(--border-hair)" : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(val) => setChecked((prev) => ({ ...prev, [item.id]: !!val }))}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13.5, fontWeight: 600, lineHeight: 1.3,
                        color: isChecked ? C.forest : "var(--ink)",
                        transition: "color 0.15s",
                      }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 2, lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    </div>
                    {isChecked && <CheckCircle2 style={{ width: 16, height: 16, color: C.forest, flexShrink: 0 }} />}
                  </label>
                );
              })}
            </div>

            {/* Notes — full width */}
            <div style={{ padding: "24px 28px", borderTop: "1px solid var(--border-hair)" }}>
              <p className="label-caps" style={{ marginBottom: 10, fontSize: 9 }}>Approval Notes</p>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Optional notes or conditions for this stage..."
                className="min-h-[100px]"
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Action footer — approver left, buttons right */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 28px",
              borderTop: "1px solid var(--border-hair)",
              background: "rgba(255,255,255,0.4)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(145deg, #4D5741, #A67763)", border: "1.5px solid rgba(208,176,96,0.25)",
                  fontSize: 11, fontWeight: 600, color: "#F4EFEB",
                }}>PN</div>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>Priya Nair</p>
                  <p style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>{stageLabels[activeStage.stage]} Reviewer</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => { setShowRejectForm((p) => !p); setRejectionSubmitted(false); }}
                  style={btnOutline}
                >
                  <AlertTriangle style={{ width: 13, height: 13 }} /> Request Changes
                </button>
                <button
                  type="button" disabled={!allChecked} onClick={handleApproveSubmit}
                  style={{
                    ...btnPrimary,
                    opacity: allChecked ? 1 : 0.45, cursor: allChecked ? "pointer" : "not-allowed",
                  }}
                >
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                  {allChecked ? "Approve Stage" : `${checkedCount}/${activeChecklist.length} Verified`}
                </button>
              </div>
            </div>

            {/* Rejection form — expands below footer */}
            <AnimatePresence>
              {showRejectForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "24px 28px", borderTop: "1px solid var(--border-hair)", background: "rgba(255,255,255,0.3)" }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                      {(["changes", "reject"] as RejectionType[]).map((type) => {
                        const active = rejectionType === type;
                        const isReject = type === "reject";
                        const v = isReject ? "brown" : "gold";
                        return (
                          <button key={type} type="button" onClick={() => setRejectionType(type)} style={{
                            flex: 1, padding: "12px 16px", borderRadius: 10, textAlign: "left" as const, cursor: "pointer",
                            border: active ? `1px solid rgba(${R[v]},0.40)` : "1px solid var(--border-hair)",
                            background: active ? `rgba(${R[v]},0.06)` : "transparent", transition: "all 0.15s",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{
                                width: 14, height: 14, borderRadius: "50%", border: `2px solid ${active ? C[v] : "var(--border-soft)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C[v] }} />}
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 600, color: active ? C[v] : "var(--ink)" }}>
                                {isReject ? "Reject SOW" : "Request Changes"}
                              </span>
                            </div>
                            <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 3, marginLeft: 22 }}>
                              {isReject ? "SOW will be terminated and cannot be resumed" : "Send back to the author for modifications"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={rejectionType === "changes" ? "Describe what needs to change..." : "Reason for rejection..."}
                      className="min-h-[100px]" style={{ marginBottom: 16, fontSize: 13 }} />
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setShowRejectForm(false)} style={btnOutline}>Cancel</button>
                      <button type="button" disabled={!rejectionReason.trim()} onClick={handleRejectSubmit} style={{
                        ...btnPrimary,
                        opacity: rejectionReason.trim() ? 1 : 0.4, cursor: rejectionReason.trim() ? "pointer" : "not-allowed",
                        background: rejectionReason.trim() && rejectionType === "reject"
                          ? "linear-gradient(135deg, #A67763, #886151)"
                          : rejectionReason.trim() ? `rgba(${R.gold},0.18)` : `rgba(${R.beige},0.3)`,
                        color: rejectionReason.trim() ? (rejectionType === "reject" ? "#FFFFFF" : C.gold) : "var(--ink-faint)",
                        border: rejectionReason.trim()
                          ? (rejectionType === "reject" ? "1px solid rgba(166,119,99,0.30)" : `1px solid rgba(${R.gold},0.30)`)
                          : "1px solid var(--border-hair)",
                        boxShadow: rejectionReason.trim() && rejectionType === "reject" ? "inset 0 1px 0 rgba(255,255,255,0.12)" : "none",
                      }}>
                        <Send style={{ width: 12, height: 12 }} />
                        {rejectionType === "changes" ? "Submit Changes" : "Reject SOW"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* ── Success states ── */}
      {approvalSubmitted && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-parchment" style={{ textAlign: "center", padding: "56px 40px" }}>
          <div style={{ ...bx("forest", 64), borderRadius: 20, margin: "0 auto 20px" }}><CheckCircle2 style={{ width: 28, height: 28, color: C.forest }} /></div>
          <h2 className="font-heading" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Stage Approved</h2>
          <p style={{ fontSize: 13, color: "var(--ink-muted)" }}><span style={{ fontWeight: 600, color: "var(--ink)" }}>{activeStage ? stageLabels[activeStage.stage] : ""}</span> review completed.</p>
          {comments && <p style={{ fontSize: 12, color: "var(--ink-faint)", fontStyle: "italic", marginTop: 8 }}>&ldquo;{comments}&rdquo;</p>}
          <Link href={`/enterprise/sow/${sow.id}`} style={{ ...btnOutline, marginTop: 24, textDecoration: "none" }}>Return to SOW</Link>
        </motion.div>
      )}

      {rejectionSubmitted && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-parchment" style={{ textAlign: "center", padding: "56px 40px" }}>
          <div style={{ ...bx(rejectionType === "changes" ? "gold" : "brown", 64), borderRadius: 20, margin: "0 auto 20px" }}>
            {rejectionType === "changes" ? <AlertTriangle style={{ width: 28, height: 28, color: C.gold }} /> : <XCircle style={{ width: 28, height: 28, color: C.brown }} />}
          </div>
          <h2 className="font-heading" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{rejectionType === "changes" ? "Changes Requested" : "SOW Rejected"}</h2>
          <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>{rejectionType === "changes" ? "Sent back for modifications." : "This SOW has been terminated."}</p>
          <p style={{ fontSize: 12, color: "var(--ink-faint)", fontStyle: "italic", maxWidth: 380, margin: "8px auto 0" }}>&ldquo;{rejectionReason}&rdquo;</p>
          <Link href={`/enterprise/sow/${sow.id}`} style={{ ...btnOutline, marginTop: 24, textDecoration: "none" }}>Return to SOW</Link>
        </motion.div>
      )}

      {allStagesApproved && !activeStage && !approvalSubmitted && !rejectionSubmitted && (
        <motion.div variants={fadeUp} className="card-parchment" style={{ textAlign: "center", padding: "56px 40px" }}>
          <div style={{ ...bx("forest", 64), borderRadius: 20, margin: "0 auto 20px" }}><Sparkles style={{ width: 28, height: 28, color: C.forest }} /></div>
          <h2 className="font-heading" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>All Stages Approved</h2>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", maxWidth: 340, margin: "0 auto 24px" }}>Ready for decomposition into tasks.</p>
          <Link href={`/enterprise/sow/${sow.id}`} style={{
            ...btnPrimary, textDecoration: "none", background: "linear-gradient(135deg, #4D5741, #3a4230)", border: "1px solid rgba(77,87,65,0.30)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(77,87,65,0.20)",
          }}><GitBranch style={{ width: 14, height: 14 }} /> Proceed to Decomposition</Link>
        </motion.div>
      )}
    </motion.div>
  );
}
