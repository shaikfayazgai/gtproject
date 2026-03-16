"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileUp,
  CheckCircle2,
  X,
  File,
  FileType,
  Loader2,
  ArrowRight,
  Search,
  Brain,
  LayoutList,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";

/* ────────────────────────────────────────────────────────────
   Parsing stages
   ──────────────────────────────────────────────────────────── */
type ParsingStage = null | "uploading" | "extracting" | "analyzing" | "detecting" | "scoring" | "complete";

const PARSING_STAGES: { key: ParsingStage; label: string; icon: React.ElementType; description: string }[] = [
  { key: "uploading", label: "Uploading", icon: Upload, description: "Transferring to secure storage" },
  { key: "extracting", label: "Text Extraction", icon: Search, description: "OCR & content extraction" },
  { key: "analyzing", label: "NLP Analysis", icon: Brain, description: "Language processing pipeline" },
  { key: "detecting", label: "Section Detection", icon: LayoutList, description: "Scope, budget, timeline, risks" },
  { key: "scoring", label: "Gap & Risk Scoring", icon: ShieldCheck, description: "Completeness & ambiguity check" },
];

function getStageIndex(stage: ParsingStage): number {
  if (!stage) return -1;
  if (stage === "complete") return PARSING_STAGES.length;
  return PARSING_STAGES.findIndex((s) => s.key === stage);
}

function getProgressPercent(stage: ParsingStage): number {
  if (!stage) return 0;
  if (stage === "complete") return 100;
  const idx = getStageIndex(stage);
  return Math.round(((idx + 0.5) / PARSING_STAGES.length) * 100);
}

/* ────────────────────────────────────────────────────────────
   File helpers
   ──────────────────────────────────────────────────────────── */
const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc";

function getFileTypeLabel(file: File): string {
  if (file.name.endsWith(".pdf")) return "PDF";
  if (file.name.endsWith(".docx")) return "DOCX";
  if (file.name.endsWith(".doc")) return "DOC";
  return "Document";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ────────────────────────────────────────────────────────────
   Mock results
   ──────────────────────────────────────────────────────────── */
const MOCK_RESULTS = {
  sectionsDetected: 14,
  aiConfidence: 92,
  gapScore: 88,
  ambiguities: 3,
  estimatedBudget: "$310,000",
  estimatedDuration: "7 months",
};

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */
export default function SOWUploadPage() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [parsingStage, setParsingStage] = React.useState<ParsingStage>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isParsing = parsingStage !== null && parsingStage !== "complete";
  const isComplete = parsingStage === "complete";

  const handleFileSelect = (file: File) => {
    const ext = file.name.toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ext.endsWith(".pdf") && !ext.endsWith(".docx") && !ext.endsWith(".doc")) return;
    setSelectedFile(file);
    setParsingStage(null);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleReset = () => { setSelectedFile(null); setParsingStage(null); };

  const startParsing = () => {
    if (!selectedFile || isParsing) return;
    const stages: ParsingStage[] = ["uploading", "extracting", "analyzing", "detecting", "scoring", "complete"];
    stages.forEach((stage, i) => { setTimeout(() => setParsingStage(stage), i * 600); });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <input ref={fileInputRef} type="file" accept={ACCEPTED_EXTENSIONS} onChange={handleInputChange} className="hidden" aria-hidden="true" />

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="relative" style={{ marginBottom: 28 }}>
        <div className="absolute pointer-events-none" style={{
          top: -60, left: -80, width: 500, height: 300,
          background: 'radial-gradient(ellipse at 20% 40%, rgba(208,176,96,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(91,155,162,0.06) 0%, transparent 45%)',
          filter: 'blur(40px)',
        }} />
        <div className="relative">
          <h1 className="font-heading leading-[1.15]" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Upload Statement of Work
          </h1>
          <p style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-muted)', fontWeight: 400, lineHeight: 1.55 }}>
            Upload your SOW document and our AI will parse, extract, and structure key sections automatically.
          </p>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════
         STATE 1: No file — Full-width drop zone
         ══════════════════════════════════════ */}
      {!selectedFile && !isParsing && !isComplete && (
        <motion.div variants={fadeUp}>
          <div
            className="card-parchment relative cursor-pointer transition-all duration-200"
            style={{
              padding: '64px 40px',
              borderStyle: isDragging ? 'dashed' : undefined,
              borderWidth: isDragging ? 2 : undefined,
              borderColor: isDragging ? 'rgba(91,155,162,0.40)' : undefined,
            }}
            onClick={handleBrowseClick}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative" style={{ marginBottom: 24 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 72, height: 72, borderRadius: 18,
                    background: 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(166,119,99,0.06))',
                    border: '1px solid rgba(91,155,162,0.20)',
                  }}
                >
                  <FileUp style={{ width: 32, height: 32, color: '#2A6068' }} />
                </div>
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: -5, right: -5, width: 24, height: 24, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5B9BA2, #4A8A90)',
                    boxShadow: '0 2px 8px rgba(91,155,162,0.30)',
                  }}
                >
                  <Sparkles style={{ width: 11, height: 11, color: '#FFFFFF' }} />
                </div>
              </div>

              <h3 className="font-heading" style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 6 }}>
                Drag & drop your SOW document
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>
                or click anywhere to browse your files
              </p>

              <button
                onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                className="flex items-center gap-2 rounded-lg transition-all duration-200"
                style={{
                  padding: '9px 20px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: 'transparent', color: 'var(--ink-mid)',
                  border: '1px solid var(--border-soft)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,119,99,0.25)'; e.currentTarget.style.background = 'rgba(166,119,99,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Upload style={{ width: 13, height: 13 }} /> Browse Files
              </button>

              <div className="flex items-center gap-3" style={{ marginTop: 20 }}>
                <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>PDF, DOCX, DOC</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-soft)', display: 'inline-block' }} />
                <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>Max 50MB</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════
         STATE 2: File selected — ready to parse
         ══════════════════════════════════════ */}
      {selectedFile && !isParsing && !isComplete && (
        <motion.div variants={fadeUp}>
          <div className="card-parchment" style={{ padding: '28px' }}>
            <div className="flex items-center gap-4">
              {/* File icon */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: selectedFile.name.endsWith(".pdf")
                    ? 'linear-gradient(135deg, rgba(166,119,99,0.14), rgba(166,119,99,0.06))'
                    : 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(91,155,162,0.06))',
                  border: `1px solid ${selectedFile.name.endsWith(".pdf") ? 'rgba(166,119,99,0.20)' : 'rgba(91,155,162,0.20)'}`,
                }}
              >
                {selectedFile.name.endsWith(".pdf")
                  ? <File style={{ width: 22, height: 22, color: '#A67763' }} />
                  : <FileType style={{ width: 22, height: 22, color: '#2A6068' }} />
                }
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }} className="truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-2" style={{ marginTop: 3 }}>
                  <span className="badge-parchment" style={{ fontSize: 10 }}>{getFileTypeLabel(selectedFile)}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                  style={{
                    padding: '8px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    background: 'transparent', color: 'var(--ink-muted)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,119,99,0.25)'; e.currentTarget.style.background = 'rgba(166,119,99,0.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <RotateCcw style={{ width: 12, height: 12 }} /> Change
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg transition-all duration-200"
                  onClick={startParsing}
                  style={{
                    padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #A67763, #886151)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(166,119,99,0.30)',
                    boxShadow: '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 3px 12px rgba(166,119,99,0.30), inset 0 1px 0 rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = ''; }}
                >
                  <Upload style={{ width: 14, height: 14 }} /> Upload & Parse
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════
         STATE 3: Parsing — progress view
         ══════════════════════════════════════ */}
      <AnimatePresence>
        {isParsing && selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-parchment" style={{ padding: '28px' }}>

              {/* Top: file info + percentage */}
              <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(91,155,162,0.06))',
                    border: '1px solid rgba(91,155,162,0.20)',
                  }}
                >
                  <Loader2 style={{ width: 16, height: 16, color: '#2A6068' }} className="animate-spin" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Parsing {selectedFile.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 1 }}>{getFileTypeLabel(selectedFile)} · {formatFileSize(selectedFile.size)}</p>
                </div>
                <span className="num-display" style={{ fontSize: 24 }}>{getProgressPercent(parsingStage)}%</span>
              </div>

              {/* Progress bar */}
              <div className="prog-track" style={{ marginBottom: 24 }}>
                <div className="prog-fill" style={{ width: `${getProgressPercent(parsingStage)}%`, background: 'linear-gradient(90deg, #5B9BA2, #8FC0C7)' }} />
              </div>

              {/* Stages — horizontal row */}
              <div className="grid grid-cols-5 gap-3">
                {PARSING_STAGES.map((stage) => {
                  const currentIdx = getStageIndex(parsingStage);
                  const stageIdx = PARSING_STAGES.indexOf(stage);
                  const isActive = stage.key === parsingStage;
                  const isDone = currentIdx > stageIdx;
                  const StageIcon = stage.icon;

                  return (
                    <div
                      key={stage.key}
                      className="flex flex-col items-center text-center rounded-lg transition-all duration-200"
                      style={{
                        padding: '14px 8px',
                        opacity: !isActive && !isDone ? 0.3 : 1,
                        background: isActive ? 'rgba(91,155,162,0.05)' : 'transparent',
                        border: isActive ? '1px solid rgba(91,155,162,0.12)' : '1px solid transparent',
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 32, height: 32, borderRadius: 9, marginBottom: 8,
                          background: isDone
                            ? 'linear-gradient(135deg, rgba(77,87,65,0.14), rgba(77,87,65,0.06))'
                            : isActive
                              ? 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(91,155,162,0.06))'
                              : 'rgba(166,119,99,0.04)',
                          border: `1px solid ${isDone ? 'rgba(77,87,65,0.20)' : isActive ? 'rgba(91,155,162,0.20)' : 'var(--border-hair)'}`,
                        }}
                      >
                        {isDone
                          ? <CheckCircle2 style={{ width: 14, height: 14, color: '#4D5741' }} />
                          : isActive
                            ? <Loader2 style={{ width: 14, height: 14, color: '#2A6068' }} className="animate-spin" />
                            : <StageIcon style={{ width: 14, height: 14, color: 'var(--ink-faint)' }} />
                        }
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: isDone ? '#344028' : isActive ? '#2A6068' : 'var(--ink-faint)' }}>{stage.label}</p>
                      <p style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, lineHeight: 1.3 }}>{stage.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
         STATE 4: Complete — results
         ══════════════════════════════════════ */}
      <AnimatePresence>
        {isComplete && selectedFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Success header card */}
            <div className="card-parchment" style={{ padding: '24px 28px', marginBottom: 16 }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(77,87,65,0.14), rgba(77,87,65,0.06))',
                    border: '1px solid rgba(77,87,65,0.20)',
                  }}
                >
                  <CheckCircle2 style={{ width: 16, height: 16, color: '#4D5741' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Parsing Complete</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 1 }}>{selectedFile.name} · {getFileTypeLabel(selectedFile)} · {formatFileSize(selectedFile.size)}</p>
                </div>
                <span className="badge-parchment" style={{
                  fontSize: 10,
                  background: 'rgba(77,87,65,0.08)',
                  color: '#344028',
                  border: '1px solid rgba(77,87,65,0.18)',
                }}>All stages passed</span>
              </div>
            </div>

            {/* KPI Row — 4 columns full width */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ marginBottom: 16 }}>
              {[
                { label: "Sections Detected", value: MOCK_RESULTS.sectionsDetected, gradient: 'linear-gradient(90deg, #A67763, #C49A88)' },
                { label: "AI Confidence", value: `${MOCK_RESULTS.aiConfidence}%`, gradient: 'linear-gradient(90deg, #4D5741, #949A8D)' },
                { label: "Completeness Score", value: `${MOCK_RESULTS.gapScore}%`, gradient: 'linear-gradient(90deg, #5B9BA2, #8FC0C7)' },
                { label: "Ambiguities Found", value: MOCK_RESULTS.ambiguities, gradient: 'linear-gradient(90deg, #D0B060, #E0CC8A)' },
              ].map((m) => (
                <div key={m.label} className="card-parchment" style={{ padding: '18px 16px', textAlign: 'center' }}>
                  <p className="num-display" style={{ fontSize: 26 }}>{m.value}</p>
                  <p style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4, fontWeight: 500 }}>{m.label}</p>
                  <div className="prog-track" style={{ marginTop: 10, height: 3 }}>
                    <div className="prog-fill" style={{ width: '100%', background: m.gradient, height: 3 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Estimates + Warning row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: 16 }}>
              <div className="card-parchment" style={{ padding: '16px 18px' }}>
                <p style={{ fontSize: 10, color: 'var(--ink-faint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Budget</p>
                <p className="num-display" style={{ fontSize: 20, marginTop: 6 }}>{MOCK_RESULTS.estimatedBudget}</p>
              </div>
              <div className="card-parchment" style={{ padding: '16px 18px' }}>
                <p style={{ fontSize: 10, color: 'var(--ink-faint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Duration</p>
                <p className="num-display" style={{ fontSize: 20, marginTop: 6 }}>{MOCK_RESULTS.estimatedDuration}</p>
              </div>
              <div className="rounded-lg" style={{
                padding: '16px 18px',
                background: 'rgba(208,176,96,0.06)',
                border: '1px solid rgba(208,176,96,0.18)',
              }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                  <AlertTriangle style={{ width: 12, height: 12, color: '#7A5020' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#7A5020' }}>{MOCK_RESULTS.ambiguities} ambiguities flagged</span>
                </div>
                <p style={{ fontSize: 11, color: '#8A6530', lineHeight: 1.4 }}>
                  Review these in the parsed SOW before decomposition.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="card-parchment" style={{ padding: '16px 20px' }}>
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                  onClick={handleReset}
                  style={{
                    padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    background: 'transparent', color: 'var(--ink-muted)',
                    border: '1px solid var(--border-soft)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,119,99,0.25)'; e.currentTarget.style.background = 'rgba(166,119,99,0.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <RotateCcw style={{ width: 12, height: 12 }} /> Upload Another
                </button>
                <Link href="/enterprise/sow/sow-003">
                  <button
                    className="flex items-center gap-2 rounded-lg transition-all duration-200"
                    style={{
                      padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      background: 'linear-gradient(135deg, #A67763, #886151)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(166,119,99,0.30)',
                      boxShadow: '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 3px 12px rgba(166,119,99,0.30), inset 0 1px 0 rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = ''; }}
                  >
                    View Parsed SOW <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
