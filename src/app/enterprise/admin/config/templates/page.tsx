"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileStack,
  Plus,
  ArrowLeft,
  Shield,
  Lock,
  Unlock,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Settings,
  Copy,
  Eye,
  Sparkles,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui";

/* ── Industry accent config ── */
const industryAccents: Record<
  string,
  { gradient: string; border: string; badge: string; tagBg: string; tagText: string }
> = {
  Healthcare: {
    gradient: "from-teal-400 to-teal-600",
    border: "border-t-teal-400",
    badge: "teal",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
  },
  "Financial Services": {
    gradient: "from-gold-400 to-gold-600",
    border: "border-t-gold-400",
    badge: "gold",
    tagBg: "bg-gold-50",
    tagText: "text-gold-800",
  },
  Technology: {
    gradient: "from-brown-400 to-brown-600",
    border: "border-t-brown-400",
    badge: "brown",
    tagBg: "bg-brown-50",
    tagText: "text-brown-700",
  },
  Retail: {
    gradient: "from-forest-400 to-forest-600",
    border: "border-t-forest-400",
    badge: "forest",
    tagBg: "bg-forest-50",
    tagText: "text-forest-700",
  },
  "All Industries": {
    gradient: "from-beige-400 to-brown-400",
    border: "border-t-beige-400",
    badge: "beige",
    tagBg: "bg-beige-100",
    tagText: "text-beige-700",
  },
  Government: {
    gradient: "from-forest-500 to-teal-500",
    border: "border-t-forest-500",
    badge: "forest",
    tagBg: "bg-forest-50",
    tagText: "text-forest-700",
  },
};

/* ── Mock template data ── */
const mockTemplates = [
  {
    id: "tpl-001",
    name: "Healthcare Standard SOW",
    industry: "Healthcare",
    status: "active" as const,
    locked: true,
    sections: 14,
    clauses: 12,
    sowsGenerated: 8,
    lastModified: "2026-02-18T10:30:00Z",
    creator: "Priya Nair",
  },
  {
    id: "tpl-002",
    name: "FinTech Compliance SOW",
    industry: "Financial Services",
    status: "active" as const,
    locked: true,
    sections: 16,
    clauses: 15,
    sowsGenerated: 6,
    lastModified: "2026-02-22T14:00:00Z",
    creator: "Rahul Sharma",
  },
  {
    id: "tpl-003",
    name: "Technology Platform SOW",
    industry: "Technology",
    status: "active" as const,
    locked: true,
    sections: 12,
    clauses: 8,
    sowsGenerated: 5,
    lastModified: "2026-03-01T09:15:00Z",
    creator: "Priya Nair",
  },
  {
    id: "tpl-004",
    name: "Retail E-Commerce SOW",
    industry: "Retail",
    status: "active" as const,
    locked: true,
    sections: 10,
    clauses: 7,
    sowsGenerated: 4,
    lastModified: "2026-02-28T16:45:00Z",
    creator: "Ananya Gupta",
  },
  {
    id: "tpl-005",
    name: "General Purpose SOW",
    industry: "All Industries",
    status: "active" as const,
    locked: false,
    sections: 8,
    clauses: 5,
    sowsGenerated: 0,
    lastModified: "2026-03-04T11:00:00Z",
    creator: "Priya Nair",
  },
  {
    id: "tpl-006",
    name: "Government RFP SOW",
    industry: "Government",
    status: "draft" as const,
    locked: false,
    sections: 18,
    clauses: 20,
    sowsGenerated: 0,
    lastModified: "2026-03-05T08:30:00Z",
    creator: "Rahul Sharma",
  },
];

/* ── Template Card ── */
function TemplateCard({
  template,
}: {
  template: (typeof mockTemplates)[0];
}) {
  const accent = industryAccents[template.industry] ?? industryAccents["All Industries"];
  const modifiedDate = new Date(template.lastModified).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "group relative rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden",
        "hover:shadow-xl hover:shadow-brown-100/20 transition-all duration-300 hover:-translate-y-0.5"
      )}
    >
      {/* Industry gradient strip */}
      <div className={cn("h-1.5 bg-gradient-to-r", accent.gradient)} />

      <div className="p-5">
        {/* Header: name + status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-brown-900 leading-snug group-hover:text-brown-950 transition-colors">
              {template.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant={accent.badge as "teal" | "gold" | "brown" | "forest" | "beige"}
                size="sm"
              >
                <Tag className="w-2.5 h-2.5" />
                {template.industry}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge
              variant={template.status === "active" ? "forest" : "beige"}
              size="sm"
              dot
            >
              {template.status === "active" ? "Active" : "Draft"}
            </Badge>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md",
                template.locked
                  ? "bg-brown-100 text-brown-700"
                  : "bg-beige-100 text-beige-600"
              )}
            >
              {template.locked ? (
                <Lock className="w-2.5 h-2.5" />
              ) : (
                <Unlock className="w-2.5 h-2.5" />
              )}
              {template.locked ? "Locked" : "Unlocked"}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-beige-50/60 border border-beige-100/60">
            <p className="text-[16px] font-bold text-brown-800 leading-none">
              {template.sections}
            </p>
            <p className="text-[9px] text-beige-500 font-medium mt-1">Sections</p>
          </div>
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-beige-50/60 border border-beige-100/60">
            <p className="text-[16px] font-bold text-teal-700 leading-none">
              {template.clauses}
            </p>
            <p className="text-[9px] text-beige-500 font-medium mt-1">Clauses</p>
          </div>
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-beige-50/60 border border-beige-100/60">
            <p className={cn(
              "text-[16px] font-bold leading-none",
              template.sowsGenerated > 0 ? "text-gold-700" : "text-beige-400"
            )}>
              {template.sowsGenerated}
            </p>
            <p className="text-[9px] text-beige-500 font-medium mt-1">SOWs</p>
          </div>
        </div>

        {/* Meta: last modified + creator */}
        <div className="flex items-center justify-between pt-3 border-t border-beige-100">
          <div className="flex items-center gap-1.5 text-[10px] text-beige-500">
            <Calendar className="w-3 h-3" />
            <span>{modifiedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-beige-500">
            <User className="w-3 h-3" />
            <span>{template.creator}</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 px-4 py-3 bg-beige-50/40 border-t border-beige-100">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-beige-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
          title="View template"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-beige-600 hover:text-brown-700 hover:bg-brown-50 transition-colors"
          title="Duplicate template"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-beige-600 hover:text-brown-700 hover:bg-brown-50 transition-colors"
          title="Edit template"
        >
          <Settings className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SOW TEMPLATES GOVERNANCE PAGE
   ================================================================ */
export default function SOWTemplatesPage() {
  const [search, setSearch] = React.useState("");

  const filtered = mockTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.industry.toLowerCase().includes(search.toLowerCase())
  );

  const totalTemplates = mockTemplates.length;
  const activeCount = mockTemplates.filter((t) => t.status === "active").length;
  const industries = new Set(mockTemplates.map((t) => t.industry)).size;
  const totalSOWs = mockTemplates.reduce((s, t) => s + t.sowsGenerated, 0);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* ── Header ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <Link
            href="/enterprise/admin/config"
            className="inline-flex items-center gap-1.5 text-[12px] text-beige-500 hover:text-brown-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Admin & Configuration
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center shadow-md shadow-brown-500/20">
              <FileStack className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              SOW Templates
            </h1>
          </div>
          <p className="text-[13px] text-beige-500 mt-1 max-w-xl">
            Manage industry-specific SOW templates for AI generation and governance.
            Locked templates constrain AI to approved structures.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="gradient-primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create SOW Template</DialogTitle>
              <DialogDescription>
                Define a new industry-specific template with required sections
                and compliance clauses.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-brown-700">
                  Template Name
                </label>
                <Input placeholder="e.g. Manufacturing QA SOW" className="h-9 text-[13px]" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-brown-700">
                  Industry
                </label>
                <Input placeholder="e.g. Manufacturing" className="h-9 text-[13px]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button variant="gradient-primary" size="sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Templates",
            value: totalTemplates,
            icon: FileStack,
            accent: "bg-brown-100 text-brown-600",
          },
          {
            label: "Active",
            value: activeCount,
            icon: CheckCircle2,
            accent: "bg-forest-100 text-forest-600",
          },
          {
            label: "Industries",
            value: industries,
            icon: Building2,
            accent: "bg-teal-100 text-teal-600",
          },
          {
            label: "SOWs Generated",
            value: totalSOWs,
            icon: Sparkles,
            accent: "bg-gold-100 text-gold-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                stat.accent
              )}
            >
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-brown-900 tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] text-beige-500 font-medium mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Search ── */}
      <motion.div variants={fadeUp}>
        <Input
          placeholder="Search templates by name or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 text-[13px] bg-white/70 backdrop-blur-sm max-w-md"
        />
      </motion.div>

      {/* ── Template Grid ── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="text-center py-16 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm"
        >
          <FileStack className="w-10 h-10 text-beige-300 mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-brown-800">
            No templates found
          </p>
          <p className="text-[12px] text-beige-500 mt-1">
            Try adjusting your search terms
          </p>
        </motion.div>
      )}

      {/* ── Info Banner: Template Locking & Hallucination Prevention ── */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-teal-200/50 bg-gradient-to-br from-teal-50/60 to-forest-50/40 backdrop-blur-sm p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-forest-500 flex items-center justify-center shadow-md shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-brown-900 mb-1.5">
              Template Locking & Hallucination Prevention
            </h3>
            <p className="text-[12px] text-brown-700/80 leading-relaxed mb-3">
              Locked templates are part of GlimmoraTeam&apos;s 8-layer hallucination prevention
              architecture. When a template is locked, the AI is constrained to generate
              SOWs strictly within the approved structure -- it cannot invent sections,
              omit required clauses, or deviate from the compliance framework defined
              by the template.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-forest-700">
                <Lock className="w-3 h-3" />
                Locked = AI-constrained to approved structure
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-beige-600">
                <Unlock className="w-3 h-3" />
                Unlocked = template still in development
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-700">
                <CheckCircle2 className="w-3 h-3" />
                All clause mappings auditable
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
