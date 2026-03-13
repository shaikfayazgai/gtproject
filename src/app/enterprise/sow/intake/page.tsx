"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  ArrowRight,
  Bot,
  Shield,
  CheckCircle2,
  Zap,
  Brain,
  Eye,
  Lock,
  Clock,
  ScanSearch,
  ListChecks,
  AlertTriangle,
  ShieldCheck,
  Fingerprint,
  ClipboardCheck,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";

/* ══════════════════════════════════════════
   8-Layer Hallucination Prevention Framework
   ══════════════════════════════════════════ */

const hallucinationLayers = [
  { icon: Shield, label: "Input Validation", description: "Schema enforcement on every parameter" },
  { icon: Lock, label: "Template Locking", description: "Immutable clause structures prevent drift" },
  { icon: ScrollText, label: "Clause Library", description: "Pre-vetted legal & technical clause bank" },
  { icon: ListChecks, label: "Completeness Checks", description: "Every required section validated pre-output" },
  { icon: Fingerprint, label: "Confidence Scoring", description: "Per-section confidence with 90% min gate" },
  { icon: ScanSearch, label: "Pattern Matching", description: "Cross-reference against industry baselines" },
  { icon: Eye, label: "Human Approval", description: "Mandatory review gate before finalization" },
  { icon: ClipboardCheck, label: "Audit Logging", description: "Every AI decision logged with full trace" },
];

/* ══════════════════════════════════════════
   Comparison Data
   ══════════════════════════════════════════ */

const comparisonRows = [
  { label: "Best For", ai: "New projects without existing SOW", manual: "Existing SOW documents needing analysis" },
  { label: "Time to Complete", ai: "~15 minutes", manual: "~5 minutes" },
  { label: "AI Involvement", ai: "Full generation with human oversight", manual: "Parsing, extraction & gap detection" },
  { label: "Hallucination Controls", ai: "8-layer framework active", manual: "Gap analysis & ambiguity flagging" },
];

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */

export default function SOWIntakePage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="relative mb-7">
        <div className="absolute pointer-events-none" style={{
          top: -60, left: -80, width: 500, height: 300,
          background: 'radial-gradient(ellipse at 20% 40%, rgba(208,176,96,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(91,155,162,0.06) 0%, transparent 45%)',
          filter: 'blur(40px)',
        }} />
        <div className="relative">
          <h1 className="font-heading leading-[1.15]" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Create New SOW
          </h1>
          <p className="whitespace-nowrap" style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-muted)', fontWeight: 400, lineHeight: 1.55 }}>
            Generate with AI or upload an existing document for intelligent parsing.
          </p>
        </div>
      </motion.div>

      {/* ── Dual Intake Cards ── */}
      <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">

        {/* AI-Generated SOW Card */}
        <motion.div variants={scaleIn}>
          <Link href="/enterprise/sow/generate" className="block">
            <div
              className="relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(155deg, rgba(253,250,247,0.95), rgba(255,255,255,0.7) 40%, rgba(249,245,241,0.6))',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border-soft)',
                boxShadow: '0 1px 3px rgba(77,55,46,0.05), 0 4px 16px rgba(77,55,46,0.04), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(77,55,46,0.08), 0 12px 40px rgba(77,55,46,0.08), inset 0 1px 0 rgba(255,255,255,0.8)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,155,162,0.30)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(77,55,46,0.05), 0 4px 16px rgba(77,55,46,0.04), inset 0 1px 0 rgba(255,255,255,0.7)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-soft)';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              {/* Visual hero area */}
              <div className="relative flex items-center justify-center" style={{
                height: 140,
                background: 'linear-gradient(135deg, rgba(91,155,162,0.06) 0%, rgba(208,176,96,0.04) 50%, rgba(166,119,99,0.03) 100%)',
                borderBottom: '1px solid var(--border-hair)',
              }}>
                {/* Decorative mesh */}
                <div className="absolute pointer-events-none" style={{
                  top: -20, right: -20, width: 180, height: 180,
                  background: 'radial-gradient(ellipse at 60% 40%, rgba(91,155,162,0.08) 0%, transparent 60%)',
                  filter: 'blur(20px)',
                }} />
                <div className="absolute pointer-events-none" style={{
                  bottom: -10, left: -10, width: 120, height: 120,
                  background: 'radial-gradient(ellipse at 40% 60%, rgba(208,176,96,0.06) 0%, transparent 60%)',
                  filter: 'blur(15px)',
                }} />
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(145deg, rgba(91,155,162,0.16), rgba(77,87,65,0.08))',
                    border: '1px solid rgba(91,155,162,0.22)',
                    boxShadow: '0 4px 16px rgba(91,155,162,0.10)',
                  }}
                >
                  <Bot className="w-6 h-6" style={{ color: '#2A6068' }} />
                </div>
                {/* Recommended badge floating top-right */}
                <span className="absolute badge-parchment" style={{
                  top: 16, right: 16,
                  background: 'rgba(91,155,162,0.08)',
                  color: '#2A6068',
                  border: '1px solid rgba(91,155,162,0.18)',
                  fontSize: 9.5,
                }}>
                  Recommended
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 24px 22px' }}>
                <h2 className="font-heading" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 5 }}>
                  AI-Generated SOW
                </h2>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  Answer guided questions and let AI craft a complete SOW with hallucination prevention.
                </p>

                {/* Compact highlight tags */}
                <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 18 }}>
                  {["Guided Wizard", "Risk Scoring", "Templates", "8-Layer Safety"].map((tag) => (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 500, color: 'var(--ink-mid)',
                      background: 'rgba(166,119,99,0.05)',
                      border: '1px solid var(--border-hair)',
                      padding: '3px 10px', borderRadius: 100,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 rounded-lg transition-all duration-200"
                    style={{
                      padding: '8px 18px',
                      background: 'linear-gradient(135deg, #A67763, #886151)',
                      color: '#FFFFFF', fontSize: 12, fontWeight: 500,
                      border: '1px solid rgba(166,119,99,0.30)',
                      boxShadow: '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                  >
                    Start Wizard <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" style={{ color: 'var(--ink-faint)' }} />
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>~15 min</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Upload SOW Card */}
        <motion.div variants={scaleIn}>
          <Link href="/enterprise/sow/upload" className="block">
            <div
              className="relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(155deg, rgba(253,250,247,0.95), rgba(255,255,255,0.7) 40%, rgba(249,245,241,0.6))',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border-soft)',
                boxShadow: '0 1px 3px rgba(77,55,46,0.05), 0 4px 16px rgba(77,55,46,0.04), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(77,55,46,0.08), 0 12px 40px rgba(77,55,46,0.08), inset 0 1px 0 rgba(255,255,255,0.8)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,119,99,0.30)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(77,55,46,0.05), 0 4px 16px rgba(77,55,46,0.04), inset 0 1px 0 rgba(255,255,255,0.7)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-soft)';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              {/* Visual hero area */}
              <div className="relative flex items-center justify-center" style={{
                height: 140,
                background: 'linear-gradient(135deg, rgba(166,119,99,0.05) 0%, rgba(208,176,96,0.04) 50%, rgba(91,155,162,0.02) 100%)',
                borderBottom: '1px solid var(--border-hair)',
              }}>
                <div className="absolute pointer-events-none" style={{
                  top: -20, left: -20, width: 180, height: 180,
                  background: 'radial-gradient(ellipse at 40% 40%, rgba(166,119,99,0.06) 0%, transparent 60%)',
                  filter: 'blur(20px)',
                }} />
                <div className="absolute pointer-events-none" style={{
                  bottom: -10, right: -10, width: 120, height: 120,
                  background: 'radial-gradient(ellipse at 60% 60%, rgba(208,176,96,0.05) 0%, transparent 60%)',
                  filter: 'blur(15px)',
                }} />
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(145deg, rgba(166,119,99,0.16), rgba(208,176,96,0.08))',
                    border: '1px solid rgba(166,119,99,0.22)',
                    boxShadow: '0 4px 16px rgba(166,119,99,0.10)',
                  }}
                >
                  <Upload className="w-6 h-6" style={{ color: '#6A4C3F' }} />
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 24px 22px' }}>
                <h2 className="font-heading" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 5 }}>
                  Upload SOW Document
                </h2>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  Upload existing SOW files for AI-enhanced parsing, extraction, and gap analysis.
                </p>

                {/* Compact highlight tags */}
                <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 18 }}>
                  {["OCR + NLP", "Gap Analysis", "Section Detection", "PDF & DOCX"].map((tag) => (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 500, color: 'var(--ink-mid)',
                      background: 'rgba(166,119,99,0.05)',
                      border: '1px solid var(--border-hair)',
                      padding: '3px 10px', borderRadius: 100,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 rounded-lg transition-all duration-200"
                    style={{
                      padding: '8px 18px',
                      background: 'rgba(166,119,99,0.06)',
                      color: '#6A4C3F', fontSize: 12, fontWeight: 500,
                      border: '1px solid rgba(166,119,99,0.20)',
                    }}
                  >
                    Upload Document <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" style={{ color: 'var(--ink-faint)' }} />
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>~5 min</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Hallucination Prevention Section ── */}
      <motion.div variants={fadeUp} className="card-parchment mb-7" style={{ padding: 0 }}>
        <div className="section-header-parchment">
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              8-Layer Hallucination Prevention
            </div>
            <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 1 }}>
              Every AI-generated SOW passes through our multi-gate safety framework.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ padding: '20px 24px 24px' }}>
          {hallucinationLayers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                className="rounded-xl transition-all duration-200"
                style={{
                  padding: '16px 14px',
                  background: 'linear-gradient(155deg, rgba(253,250,247,0.95), rgba(255,255,255,0.7) 40%, rgba(249,245,241,0.6))',
                  border: '1px solid var(--border-soft)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,119,99,0.22)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(77,55,46,0.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-soft)'; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: 'linear-gradient(135deg, rgba(166,119,99,0.10), rgba(208,176,96,0.05))',
                      border: '1px solid rgba(166,119,99,0.14)',
                    }}
                  >
                    <Icon className="w-3 h-3" style={{ color: '#6A4C3F' }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: 8.5, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                    Layer {i + 1}
                  </span>
                </div>
                <h4 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 3, lineHeight: 1.3 }}>
                  {layer.label}
                </h4>
                <p style={{ fontSize: 10.5, color: 'var(--ink-muted)', lineHeight: 1.45 }}>
                  {layer.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Quick Comparison ── */}
      <motion.div variants={fadeUp} className="card-parchment" style={{ padding: 0 }}>
        <div className="section-header-parchment">
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Quick Comparison
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
                <th style={{ padding: '11px 20px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-faint)', background: 'rgba(166,119,99,0.02)' }}>
                  Criteria
                </th>
                <th style={{ padding: '11px 20px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-faint)', background: 'rgba(166,119,99,0.02)' }}>
                  <div className="flex items-center gap-2">
                    <Bot className="w-3 h-3" style={{ color: '#2A6068' }} /> AI-Generated
                  </div>
                </th>
                <th style={{ padding: '11px 20px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-faint)', background: 'rgba(166,119,99,0.02)' }}>
                  <div className="flex items-center gap-2">
                    <Upload className="w-3 h-3" style={{ color: '#6A4C3F' }} /> Manual Upload
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  <td style={{ padding: '13px 20px', fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{row.label}</td>
                  <td style={{ padding: '13px 20px', fontSize: 12, color: 'var(--ink-mid)' }}>{row.ai}</td>
                  <td style={{ padding: '13px 20px', fontSize: 12, color: 'var(--ink-mid)' }}>{row.manual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pro tip footer */}
        <div className="flex items-center gap-2" style={{ padding: '14px 20px', borderTop: '1px solid var(--border-hair)' }}>
          <Zap className="w-3 h-3 shrink-0" style={{ color: '#D0B060' }} />
          <p style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink-mid)' }}>Pro tip:</span>{" "}
            Start with AI generation for new engagements. Use manual upload when clients provide their own SOW documents.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
