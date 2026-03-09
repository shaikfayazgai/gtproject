"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileText,
  ArrowRight,
  Bot,
  Shield,
  CheckCircle2,
  Zap,
  Brain,
  Eye,
  Lock,
  Clock,
  Layers,
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
import { Badge, Button } from "@/components/ui";

/* ══════════════════════════════════════════
   8-Layer Hallucination Prevention Framework
   ══════════════════════════════════════════ */

const hallucinationLayers = [
  {
    icon: Shield,
    label: "Input Validation",
    description: "Schema enforcement on every parameter",
    color: "text-brown-600",
    bg: "bg-brown-50",
    border: "border-brown-100",
  },
  {
    icon: Lock,
    label: "Template Locking",
    description: "Immutable clause structures prevent drift",
    color: "text-forest-600",
    bg: "bg-forest-50",
    border: "border-forest-100",
  },
  {
    icon: ScrollText,
    label: "Clause Library",
    description: "Pre-vetted legal & technical clause bank",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: ListChecks,
    label: "Completeness Checks",
    description: "Every required section validated pre-output",
    color: "text-gold-700",
    bg: "bg-gold-50",
    border: "border-gold-100",
  },
  {
    icon: Fingerprint,
    label: "Confidence Scoring",
    description: "Per-section confidence with 90% min gate",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: ScanSearch,
    label: "Pattern Matching",
    description: "Cross-reference against industry baselines",
    color: "text-brown-600",
    bg: "bg-brown-50",
    border: "border-brown-100",
  },
  {
    icon: Eye,
    label: "Human Approval",
    description: "Mandatory review gate before finalization",
    color: "text-forest-700",
    bg: "bg-forest-50",
    border: "border-forest-100",
  },
  {
    icon: ClipboardCheck,
    label: "Audit Logging",
    description: "Every AI decision logged with full trace",
    color: "text-gold-700",
    bg: "bg-gold-50",
    border: "border-gold-100",
  },
];

/* ══════════════════════════════════════════
   Comparison Data
   ══════════════════════════════════════════ */

const comparisonRows = [
  {
    label: "Best For",
    ai: "New projects without existing SOW",
    manual: "Existing SOW documents needing analysis",
  },
  {
    label: "Time to Complete",
    ai: "~15 minutes",
    manual: "~5 minutes",
  },
  {
    label: "AI Involvement",
    ai: "Full generation with human oversight",
    manual: "Parsing, extraction & gap detection",
  },
  {
    label: "Hallucination Controls",
    ai: "8-layer framework active",
    manual: "Gap analysis & ambiguity flagging",
  },
];

/* ══════════════════════════════════════════
   Floating Particle Decoration
   ══════════════════════════════════════════ */

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-teal-200/20 to-teal-400/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-brown-200/15 to-gold-200/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-beige-200/10 to-transparent blur-3xl" />
    </div>
  );
}

/* ══════════════════════════════════════════
   Intake Mode Card
   ══════════════════════════════════════════ */

function IntakeCard({
  icon: Icon,
  accentGradient,
  glowColor,
  title,
  subtitle,
  features,
  badge,
  badgeVariant,
  ctaLabel,
  ctaHref,
  ctaVariant,
  timeEstimate,
  decorationGradient,
  index,
}: {
  icon: React.ElementType;
  accentGradient: string;
  glowColor: string;
  title: string;
  subtitle: string;
  features: string[];
  badge?: string;
  badgeVariant?: "teal" | "brown";
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "gradient-forest" | "gradient-primary";
  timeEstimate: string;
  decorationGradient: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      variants={scaleIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Outer glow on hover */}
      <div
        className={cn(
          "absolute -inset-px rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm",
          glowColor
        )}
      />

      {/* Card */}
      <div className="relative rounded-[20px] border border-beige-200/60 bg-white/75 backdrop-blur-md overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-brown-200/20 group-hover:-translate-y-1 group-hover:border-beige-300/80">
        {/* Top gradient accent strip */}
        <div className={cn("h-1.5", accentGradient)} />

        {/* Decorative corner gradient */}
        <div
          className={cn(
            "absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500",
            decorationGradient
          )}
        />

        {/* Content */}
        <div className="relative p-7 sm:p-8">
          {/* Icon + Badge Row */}
          <div className="flex items-start justify-between mb-6">
            <div className="relative">
              <motion.div
                animate={isHovered ? { rotate: [0, -5, 5, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                  accentGradient
                )}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
              {/* Subtle pulse ring */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700",
                  accentGradient,
                  "animate-ping"
                )}
                style={{ animationDuration: "2s" }}
              />
            </div>

            {badge && (
              <Badge variant={badgeVariant} size="md" dot>
                {badge}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-heading font-bold text-brown-950 tracking-tight mb-2 group-hover:text-brown-900 transition-colors">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-[13px] text-beige-600 leading-relaxed mb-6 max-w-sm">
            {subtitle}
          </p>

          {/* Feature List */}
          <div className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 + index * 0.15, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-forest-500" />
                </div>
                <span className="text-[13px] text-brown-700 leading-snug">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-beige-200/80 to-transparent mb-6" />

          {/* Footer: CTA + Time */}
          <div className="flex items-center justify-between gap-4">
            <Link href={ctaHref} className="flex-1">
              <Button variant={ctaVariant} size="lg" className="w-full group/btn">
                {ctaLabel}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-beige-400" />
              <span className="text-[12px] font-semibold text-beige-500">
                {timeEstimate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */

export default function SOWIntakePage() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative max-w-[1200px] mx-auto space-y-10 pb-12"
    >
      <FloatingOrbs />

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="relative text-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50/80 border border-teal-100/60 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            V2.0 Dual Intake Engine
          </span>
        </div>

        <h1 className="text-3xl sm:text-[36px] font-heading font-bold text-brown-950 tracking-[-0.025em] leading-tight">
          Create New SOW
        </h1>
        <p className="text-[15px] text-beige-600 mt-3 max-w-lg mx-auto leading-relaxed">
          Choose your path -- let AI generate a complete Statement of Work from
          guided parameters, or upload an existing document for intelligent parsing.
        </p>
      </motion.div>

      {/* ── Dual Intake Cards ── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative"
      >
        {/* Decorative center connector (visible on desktop) */}
        <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-beige-200/80 shadow-lg flex items-center justify-center">
            <span className="text-[11px] font-bold text-beige-500 uppercase">or</span>
          </div>
        </div>

        {/* Mobile "or" divider */}
        <div className="flex lg:hidden items-center gap-4 -my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-beige-200/80" />
          <span className="text-[12px] font-bold text-beige-400 uppercase">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-beige-200/80" />
        </div>

        <IntakeCard
          icon={Bot}
          accentGradient="bg-gradient-to-br from-teal-400 to-teal-600"
          glowColor="bg-teal-400/20"
          title="AI-Generated SOW"
          subtitle="Answer guided questions and let AI craft your Statement of Work with built-in hallucination prevention."
          features={[
            "10-step parameter wizard",
            "8-layer hallucination prevention",
            "Industry-specific templates",
            "Automatic risk scoring",
            "Confidence scoring (90% min threshold)",
          ]}
          badge="Recommended"
          badgeVariant="teal"
          ctaLabel="Start Wizard"
          ctaHref="/enterprise/sow/generate"
          ctaVariant="gradient-forest"
          timeEstimate="~15 min"
          decorationGradient="bg-gradient-to-br from-teal-300 to-teal-600"
          index={0}
        />

        <IntakeCard
          icon={Upload}
          accentGradient="bg-gradient-to-br from-brown-400 to-brown-600"
          glowColor="bg-brown-400/15"
          title="Upload SOW Document"
          subtitle="Upload your existing SOW file for AI-enhanced parsing, section extraction, and comprehensive gap analysis."
          features={[
            "OCR + NLP document parsing",
            "Automated gap analysis",
            "Smart section detection",
            "Risk and ambiguity flagging",
            "Multi-format support (PDF, DOCX)",
          ]}
          ctaLabel="Upload Document"
          ctaHref="/enterprise/sow/upload"
          ctaVariant="gradient-primary"
          timeEstimate="~5 min"
          decorationGradient="bg-gradient-to-br from-brown-300 to-brown-600"
          index={1}
        />
      </motion.div>

      {/* ── Hallucination Prevention Banner ── */}
      <motion.div variants={fadeUp} className="relative">
        <div className="rounded-2xl overflow-hidden border border-teal-200/40">
          {/* Gradient background */}
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-forest-700 p-8 sm:p-10 relative">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Header */}
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                  8-Layer Hallucination Prevention
                </h2>
                <p className="text-teal-100/80 text-[13px] mt-0.5">
                  Every AI-generated SOW passes through our multi-gate safety framework before reaching you.
                </p>
              </div>
            </div>

            {/* 8 Layers Grid */}
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
              {hallucinationLayers.map((layer, i) => (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                  className="group/layer rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/[0.15] transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <layer.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-100 uppercase tracking-wider opacity-60">
                      Layer {i + 1}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-semibold text-white mb-1 leading-snug">
                    {layer.label}
                  </h4>
                  <p className="text-[11px] text-teal-100/70 leading-relaxed">
                    {layer.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Comparison Section ── */}
      <motion.div variants={fadeUp} className="relative">
        <div className="text-center mb-6">
          <h2 className="text-lg font-heading font-bold text-brown-950 tracking-tight">
            Quick Comparison
          </h2>
          <p className="text-[13px] text-beige-500 mt-1">
            Not sure which path to choose? Here is a side-by-side breakdown.
          </p>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-px bg-beige-100/50">
            <div className="bg-white/80 p-4">
              <span className="text-[11px] font-bold text-beige-400 uppercase tracking-wider">
                Criteria
              </span>
            </div>
            <div className="bg-gradient-to-r from-teal-50/80 to-teal-50/40 p-4 flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-600" />
              <span className="text-[12px] font-bold text-teal-700 uppercase tracking-wider">
                AI-Generated
              </span>
            </div>
            <div className="bg-gradient-to-r from-brown-50/80 to-brown-50/40 p-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-brown-500" />
              <span className="text-[12px] font-bold text-brown-700 uppercase tracking-wider">
                Manual Upload
              </span>
            </div>
          </div>

          {/* Table Rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-3 gap-px",
                i < comparisonRows.length - 1 && "border-b border-beige-100/80"
              )}
            >
              <div className="p-4 flex items-center bg-beige-50/30">
                <span className="text-[12px] font-semibold text-brown-800">
                  {row.label}
                </span>
              </div>
              <div className="p-4 bg-teal-50/20">
                <span className="text-[12px] text-brown-700 leading-relaxed">
                  {row.ai}
                </span>
              </div>
              <div className="p-4 bg-brown-50/20">
                <span className="text-[12px] text-brown-700 leading-relaxed">
                  {row.manual}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Helper tip */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Zap className="w-3.5 h-3.5 text-gold-500" />
          <p className="text-[12px] text-beige-500">
            <span className="font-semibold text-brown-700">Pro tip:</span>{" "}
            Start with AI generation for new engagements. Use manual upload when
            clients provide their own SOW documents.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
