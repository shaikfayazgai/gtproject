"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Plus,
  DollarSign,
  Shield,
  Upload,
  Calendar,
  Bot,
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";

/* ── Status badge config ── */
const statusVariantMap: Record<string, "beige" | "forest" | "teal" | "gold" | "brown"> = {
  draft: "beige",
  parsing: "teal",
  review: "teal",
  approval: "gold",
  approved: "forest",
  rejected: "brown",
  changes_requested: "gold",
  archived: "beige",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  parsing: "Parsing",
  review: "In Review",
  approval: "In Approval",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes Requested",
  archived: "Archived",
};

/* ── Data sensitivity badge config ── */
const sensitivityVariant: Record<string, "teal" | "beige" | "gold" | "brown"> = {
  public: "teal",
  internal: "beige",
  confidential: "gold",
  restricted: "brown",
};

const sensitivityLabel: Record<string, string> = {
  public: "Public",
  internal: "Internal",
  confidential: "Confidential",
  restricted: "Restricted",
};

/* ── Risk tier (B1 spec: Low 0-25, Medium 26-50, High 51-75, Critical 76-100) ── */
function riskColor(score: number): string {
  if (score <= 25) return "text-forest-600";
  if (score <= 50) return "text-gold-600";
  return "text-brown-700";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Sort types ── */
type SortField = "title" | "client" | "intake" | "status" | "sensitivity" | "risk" | "version" | "modified";
type SortDir = "asc" | "desc";

export default function SOWListPage() {
  const router = useRouter();

  /* Filter state */
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [intakeFilter, setIntakeFilter] = React.useState("all");
  const [riskFilter, setRiskFilter] = React.useState("all");
  const [sensitivityFilter, setSensitivityFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  /* Unique clients for filter dropdown */
  const uniqueClients = React.useMemo(
    () => [...new Set(mockSOWs.map((s) => s.client))].sort(),
    []
  );

  /* Sort state — default: last modified descending */
  const [sortField, setSortField] = React.useState<SortField>("modified");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  /* Pagination state */
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  /* ── Filtered + sorted list ── */
  const filtered = React.useMemo(() => {
    let list = [...mockSOWs];

    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }

    if (intakeFilter !== "all") {
      list = list.filter((s) => s.intakeMode === intakeFilter);
    }

    if (riskFilter !== "all") {
      list = list.filter((s) => {
        const score = s.riskScore.overall;
        switch (riskFilter) {
          case "low": return score > 0 && score <= 25;
          case "medium": return score > 25 && score <= 50;
          case "high": return score > 50 && score <= 75;
          case "critical": return score > 75;
          default: return true;
        }
      });
    }

    if (sensitivityFilter !== "all") {
      list = list.filter((s) => s.dataSensitivity === sensitivityFilter);
    }

    if (clientFilter !== "all") {
      list = list.filter((s) => s.client === clientFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date("2026-03-09T00:00:00Z");
      const cutoff = new Date(now);
      switch (dateFilter) {
        case "7d": cutoff.setDate(now.getDate() - 7); break;
        case "30d": cutoff.setDate(now.getDate() - 30); break;
        case "90d": cutoff.setDate(now.getDate() - 90); break;
      }
      list = list.filter((s) => new Date(s.updatedAt) >= cutoff);
    }

    /* Search: title, client, SOW ID, stakeholder names, deliverables text (per B1 spec) */
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.client.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.stakeholders.some((st) => st.toLowerCase().includes(q)) ||
          mockSOWSections
            .filter((sec) => sec.sowId === s.id)
            .some((sec) => sec.content.toLowerCase().includes(q))
      );
    }

    /* Sort */
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title": cmp = a.title.localeCompare(b.title); break;
        case "client": cmp = a.client.localeCompare(b.client); break;
        case "intake": cmp = a.intakeMode.localeCompare(b.intakeMode); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "sensitivity": cmp = (a.dataSensitivity || "").localeCompare(b.dataSensitivity || ""); break;
        case "risk": cmp = a.riskScore.overall - b.riskScore.overall; break;
        case "version": cmp = a.version - b.version; break;
        case "modified": cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [statusFilter, intakeFilter, riskFilter, sensitivityFilter, clientFilter, dateFilter, search, sortField, sortDir]);

  /* Reset to page 1 when any filter changes */
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, intakeFilter, riskFilter, sensitivityFilter, clientFilter, dateFilter, search]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ── Summary stats ── */
  const totalSOWs = mockSOWs.length;
  const pendingCount = mockSOWs.filter((s) => ["approval", "review", "parsing"].includes(s.status)).length;
  const approvedCount = mockSOWs.filter((s) => s.status === "approved").length;
  const scoredSOWs = mockSOWs.filter((s) => s.riskScore.overall > 0);
  const avgRisk = scoredSOWs.length > 0
    ? Math.round(scoredSOWs.reduce((sum, s) => sum + s.riskScore.overall, 0) / scoredSOWs.length)
    : 0;
  const totalBudget = mockSOWs.reduce((sum, s) => sum + s.estimatedBudget, 0);

  /* ── Sortable column header ── */
  function SortHeader({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) {
    const active = sortField === field;
    return (
      <TableHead
        className={cn("cursor-pointer select-none group/sort hover:text-brown-700 transition-colors", className)}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          <span>{children}</span>
          <span className={cn("transition-opacity", active ? "opacity-100" : "opacity-0 group-hover/sort:opacity-40")}>
            {active && sortDir === "asc" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
          </span>
        </div>
      </TableHead>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1400px] mx-auto space-y-6"
    >
      {/* ── Page Header ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-brown-900 tracking-tight font-heading">
            SOW Repository
          </h1>
          <p className="text-sm text-beige-600 mt-1">
            Manage all Statements of Work — upload, track, and approve across projects.
          </p>
        </div>
        <Link href="/enterprise/sow/intake">
          <Button variant="gradient-primary" size="md">
            <Plus className="w-4 h-4" />
            New SOW
          </Button>
        </Link>
      </motion.div>

      {/* ── Summary Cards ── */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {[
          { label: "Total SOWs", value: totalSOWs.toString(), icon: FileText, accent: "text-brown-500", bg: "bg-brown-50" },
          { label: "Pending Action", value: pendingCount.toString(), icon: AlertTriangle, accent: "text-gold-600", bg: "bg-gold-50" },
          { label: "Approved", value: approvedCount.toString(), icon: Shield, accent: "text-forest-600", bg: "bg-forest-50" },
          { label: "Avg Risk Score", value: avgRisk.toString(), icon: AlertTriangle, accent: avgRisk <= 25 ? "text-forest-600" : "text-gold-600", bg: avgRisk <= 25 ? "bg-forest-50" : "bg-gold-50" },
          { label: "Total Budget", value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, accent: "text-teal-600", bg: "bg-teal-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-3.5 h-3.5", stat.accent)} />
              </div>
              <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-brown-900 tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Filter Bar ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-sm w-full sm:w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="parsing">Parsing</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="approval">In Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="changes_requested">Changes Requested</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Intake Mode */}
        <Select value={intakeFilter} onValueChange={setIntakeFilter}>
          <SelectTrigger className="h-9 text-sm w-full sm:w-[152px]">
            <SelectValue placeholder="All Intake Modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intake Modes</SelectItem>
            <SelectItem value="ai_generated">AI-Generated</SelectItem>
            <SelectItem value="manual_upload">Manual Upload</SelectItem>
          </SelectContent>
        </Select>

        {/* Risk Level */}
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="h-9 text-sm w-full sm:w-[140px]">
            <SelectValue placeholder="All Risk Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low (0–25)</SelectItem>
            <SelectItem value="medium">Medium (26–50)</SelectItem>
            <SelectItem value="high">High (51–75)</SelectItem>
            <SelectItem value="critical">Critical (76–100)</SelectItem>
          </SelectContent>
        </Select>

        {/* Data Sensitivity */}
        <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
          <SelectTrigger className="h-9 text-sm w-full sm:w-[148px]">
            <Shield className="w-3.5 h-3.5 mr-1 text-beige-400 shrink-0" />
            <SelectValue placeholder="All Sensitivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sensitivity</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="confidential">Confidential</SelectItem>
            <SelectItem value="restricted">Restricted</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="h-9 text-sm w-full sm:w-[138px]">
            <Calendar className="w-3.5 h-3.5 mr-1 text-beige-400 shrink-0" />
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* Client / Stakeholder */}
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-9 text-sm w-full sm:w-[168px]">
            <Building2 className="w-3.5 h-3.5 mr-1 text-beige-400 shrink-0" />
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {uniqueClients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search (covers title, client, SOW ID, stakeholders, deliverables per B1) */}
        <div className="flex-1 min-w-[200px]">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search title, client, ID, deliverables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      </motion.div>

      {/* ── Zero-SOW empty state: "Create your first SOW" CTA ── */}
      {mockSOWs.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brown-100 to-beige-100 flex items-center justify-center mb-5">
              <FileText className="w-8 h-8 text-brown-400" />
            </div>
            <h2 className="text-lg font-bold text-brown-900 mb-2 font-heading">
              Create your first SOW
            </h2>
            <p className="text-sm text-beige-600 max-w-sm mb-6">
              Upload or generate a Statement of Work to kick off your first project.
              Our AI will parse, analyze risk, and prepare it for approval.
            </p>
            <Link href="/enterprise/sow/intake">
              <Button variant="gradient-primary" size="md">
                <Plus className="w-4 h-4" />
                New SOW
              </Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* ── SOW Table ── */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-x-auto"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortHeader field="title">Title</SortHeader>
                  <SortHeader field="client">Client</SortHeader>
                  <SortHeader field="intake">Intake</SortHeader>
                  <SortHeader field="status">Status</SortHeader>
                  <SortHeader field="sensitivity">Sensitivity</SortHeader>
                  <SortHeader field="risk" className="text-center">Risk</SortHeader>
                  <SortHeader field="version" className="text-center">Version</SortHeader>
                  <SortHeader field="modified">Modified</SortHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((sow) => (
                  <motion.tr
                    key={sow.id}
                    variants={scaleIn}
                    onClick={() => router.push(`/enterprise/sow/${sow.id}`)}
                    className="border-b border-beige-100 transition-colors hover:bg-brown-50/50 cursor-pointer group"
                  >
                    {/* Title + SOW ID (spec: SOW ID column — combined with title for space efficiency) */}
                    <TableCell className="max-w-[260px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brown-100 to-beige-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-brown-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-brown-900 truncate group-hover:text-brown-700 transition-colors">
                            {sow.title}
                          </p>
                          <p className="text-[11px] text-beige-500 font-mono">
                            {sow.id.toUpperCase()} · {sow.pages} pg
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Client */}
                    <TableCell>
                      <span className="text-[13px] text-brown-800">{sow.client}</span>
                    </TableCell>

                    {/* Intake Mode */}
                    <TableCell>
                      <Badge
                        variant={sow.intakeMode === "ai_generated" ? "teal" : "beige"}
                        size="sm"
                      >
                        {sow.intakeMode === "ai_generated" ? (
                          <><Bot className="w-2.5 h-2.5" /> AI-Generated</>
                        ) : (
                          <><Upload className="w-2.5 h-2.5" /> Manual Upload</>
                        )}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={statusVariantMap[sow.status]} size="sm" dot>
                        {statusLabel[sow.status]}
                      </Badge>
                    </TableCell>

                    {/* Data Sensitivity */}
                    <TableCell>
                      <Badge variant={sensitivityVariant[sow.dataSensitivity]} size="sm">
                        {sensitivityLabel[sow.dataSensitivity]}
                      </Badge>
                    </TableCell>

                    {/* Risk Score */}
                    <TableCell className="text-center">
                      {sow.riskScore.overall > 0 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={cn("text-[12px] font-mono font-bold", riskColor(sow.riskScore.overall))}>
                            {sow.riskScore.overall}
                          </span>
                          {sow.riskScore.overall > 25 && (
                            <AlertTriangle className="w-3 h-3 text-gold-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-beige-400">—</span>
                      )}
                    </TableCell>

                    {/* Version */}
                    <TableCell className="text-center">
                      <span className="text-[13px] font-mono font-semibold text-brown-700">
                        v{sow.version}
                      </span>
                    </TableCell>

                    {/* Last Modified */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-beige-400" />
                        <span className="text-[12px] text-beige-600">
                          {formatDate(sow.updatedAt)}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {/* Filter-no-results empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-beige-100 flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-beige-400" />
                </div>
                <p className="text-sm font-semibold text-brown-800 mb-1">
                  No SOWs match your filters
                </p>
                <p className="text-xs text-beige-500 max-w-xs">
                  Try different keywords or clear filters to see all SOWs.
                </p>
              </div>
            )}
          </motion.div>

          {/* ── Pagination — only show controls when items exceed page size ── */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            {filtered.length > pageSize ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-beige-500">Rows per page</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}
                  >
                    <SelectTrigger className="h-8 text-xs w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-beige-500">
                    {`${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="w-8 h-8 rounded-lg border border-beige-200 flex items-center justify-center text-beige-500 hover:bg-beige-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="w-8 h-8 rounded-lg border border-beige-200 flex items-center justify-center text-beige-500 hover:bg-beige-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[12px] text-beige-500">
                {filtered.length === 0 ? "No results" : `Showing ${filtered.length} SOW${filtered.length !== 1 ? "s" : ""}`}
              </p>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
