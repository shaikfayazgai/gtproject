"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Target,
  Code2,
  Calendar,
  DollarSign,
  Users,
  ShieldCheck,
  Lock,
  AlertTriangle,
  ClipboardCheck,
  Plus,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";


/* ══════════════════════════════════════════
   Step definitions
   ══════════════════════════════════════════ */
const STEPS = [
  { label: "Project Overview", icon: FileText, short: "Overview" },
  { label: "Scope Definition", icon: Target, short: "Scope" },
  { label: "Technical Requirements", icon: Code2, short: "Technical" },
  { label: "Timeline & Milestones", icon: Calendar, short: "Timeline" },
  { label: "Budget Parameters", icon: DollarSign, short: "Budget" },
  { label: "Team Requirements", icon: Users, short: "Team" },
  { label: "Quality Standards", icon: ShieldCheck, short: "Quality" },
  { label: "Security & Compliance", icon: Lock, short: "Security" },
  { label: "Risk Parameters", icon: AlertTriangle, short: "Risk" },
  { label: "Review & Generate", icon: ClipboardCheck, short: "Review" },
] as const;


/* ══════════════════════════════════════════
   Form data
   ══════════════════════════════════════════ */
interface FormData {
  title: string;
  client: string;
  industry: string;
  projectType: string;
  objectives: string;
  deliverables: string[];
  outOfScope: string;
  techStack: string;
  infrastructure: string;
  integrations: string[];
  startDate: string;
  endDate: string;
  milestones: string[];
  phasingStrategy: string;
  budgetMin: string;
  budgetMax: string;
  currency: string;
  breakdownPreference: string;
  teamSize: string;
  roles: string[];
  skillPriorities: string;
  workModel: string;
  acceptanceCriteria: string;
  slaUptime: string;
  testingRequirements: string;
  codeReviewPolicy: string;
  dataSensitivity: string;
  regulations: string[];
  encryptionRequirements: string;
  accessControl: string;
  knownRisks: string[];
  constraints: string;
  contingencyBudget: string;
  escalationProcess: string;
}

const initialFormData: FormData = {
  title: "", client: "", industry: "", projectType: "",
  objectives: "", deliverables: [""], outOfScope: "",
  techStack: "", infrastructure: "", integrations: [""],
  startDate: "", endDate: "", milestones: [""], phasingStrategy: "",
  budgetMin: "", budgetMax: "", currency: "USD", breakdownPreference: "",
  teamSize: "", roles: [""], skillPriorities: "", workModel: "",
  acceptanceCriteria: "", slaUptime: "", testingRequirements: "", codeReviewPolicy: "",
  dataSensitivity: "", regulations: [""], encryptionRequirements: "", accessControl: "",
  knownRisks: [""], constraints: "", contingencyBudget: "", escalationProcess: "",
};

/* ══════════════════════════════════════════
   Step transition
   ══════════════════════════════════════════ */
const stepTransition = {
  initial: { opacity: 0, x: 40, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, x: -40, scale: 0.98, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ══════════════════════════════════════════
   Custom date picker (no native widget)
   ══════════════════════════════════════════ */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function DateInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = React.useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(parsed?.getMonth() ?? today.getMonth());

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4 + window.scrollY, left: rect.left + window.scrollX });
    }
  }, [open]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatDisplay = (v: string) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    if (isNaN(d.getTime())) return v;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const days: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const isSelected = (day: number) =>
    parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex h-10 w-full items-center rounded-lg border bg-white/80 px-3.5 py-2 pr-10 font-body text-sm transition-all duration-200 cursor-pointer text-left"
        style={{ color: value ? 'var(--ink)' : 'var(--ink-faint)', borderColor: open ? 'rgba(166,119,99,0.35)' : 'var(--border-soft)', boxShadow: open ? '0 0 0 2px rgba(166,119,99,0.08)' : 'none' }}
      >
        {formatDisplay(value) || placeholder || 'Select date'}
      </button>
      <Calendar
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: 15, height: 15, color: 'var(--ink-faint)' }}
      />

      {open && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className="fixed rounded-lg bg-white"
          style={{
            top: pos.top, left: pos.left,
            zIndex: 9999,
            width: 280, padding: 16,
            border: '1px solid var(--border-soft)',
            boxShadow: '0 8px 24px rgba(77,55,46,0.10), 0 2px 6px rgba(77,55,46,0.06)',
          }}
        >
          {/* Month/year nav */}
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <button type="button" onClick={prevMonth} className="flex items-center justify-center rounded-md transition-colors" style={{ width: 28, height: 28, color: 'var(--ink-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(166,119,99,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <ArrowLeft style={{ width: 14, height: 14 }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="flex items-center justify-center rounded-md transition-colors" style={{ width: 28, height: 28, color: 'var(--ink-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(166,119,99,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0" style={{ marginBottom: 4 }}>
            {DAY_LABELS.map(d => (
              <div key={d} className="flex items-center justify-center" style={{ height: 28, fontSize: 10, fontWeight: 600, color: 'var(--ink-faint)', letterSpacing: '0.03em' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0">
            {days.map((day, i) => (
              <div key={i} className="flex items-center justify-center" style={{ height: 32 }}>
                {day && (
                  <button
                    type="button"
                    onClick={() => selectDay(day)}
                    className="flex items-center justify-center rounded-md transition-all duration-150"
                    style={{
                      width: 30, height: 30, fontSize: 12, fontWeight: isSelected(day) ? 600 : 400,
                      background: isSelected(day) ? 'linear-gradient(135deg, #A67763, #886151)' : 'transparent',
                      color: isSelected(day) ? '#FFFFFF' : isToday(day) ? '#A67763' : 'var(--ink)',
                      border: isToday(day) && !isSelected(day) ? '1px solid rgba(166,119,99,0.30)' : '1px solid transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (!isSelected(day)) e.currentTarget.style.background = 'rgba(166,119,99,0.06)'; }}
                    onMouseLeave={e => { if (!isSelected(day)) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════ */
export default function SOWGenerateWizardPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const addListItem = (key: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [key]: [...(prev[key] as string[]), ""] }));
  };
  const removeListItem = (key: keyof FormData, idx: number) => {
    setFormData((prev) => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== idx) }));
  };
  const updateListItem = (key: keyof FormData, idx: number, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: (prev[key] as string[]).map((item, i) => (i === idx ? value : item)) }));
  };

  const calculateConfidence = React.useCallback(() => {
    const checks: boolean[] = [
      formData.title.trim().length > 0, formData.client.trim().length > 0,
      formData.industry.length > 0, formData.projectType.length > 0,
      formData.objectives.trim().length > 0, formData.deliverables.some((d) => d.trim().length > 0),
      formData.outOfScope.trim().length > 0, formData.techStack.trim().length > 0,
      formData.infrastructure.length > 0, formData.integrations.some((i) => i.trim().length > 0),
      formData.startDate.length > 0, formData.endDate.length > 0,
      formData.milestones.some((m) => m.trim().length > 0), formData.phasingStrategy.length > 0,
      formData.budgetMin.length > 0, formData.budgetMax.length > 0, formData.breakdownPreference.length > 0,
      formData.teamSize.length > 0, formData.roles.some((r) => r.trim().length > 0), formData.workModel.length > 0,
      formData.acceptanceCriteria.trim().length > 0, formData.slaUptime.length > 0, formData.testingRequirements.length > 0,
      formData.dataSensitivity.length > 0, formData.regulations.some((r) => r.trim().length > 0),
      formData.encryptionRequirements.length > 0, formData.knownRisks.some((r) => r.trim().length > 0),
      formData.constraints.trim().length > 0, formData.contingencyBudget.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formData]);

  const aiConfidence = calculateConfidence();

  const isStepComplete = React.useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0: return formData.title.trim().length > 0 && formData.client.trim().length > 0;
        case 1: return formData.objectives.trim().length > 0 && formData.deliverables.some((d) => d.trim().length > 0);
        case 2: return formData.techStack.trim().length > 0;
        case 3: return formData.startDate.length > 0 && formData.endDate.length > 0;
        case 4: return formData.budgetMin.length > 0 || formData.budgetMax.length > 0;
        case 5: return formData.roles.some((r) => r.trim().length > 0);
        case 6: return formData.acceptanceCriteria.trim().length > 0;
        case 7: return formData.dataSensitivity.length > 0;
        case 8: return formData.knownRisks.some((r) => r.trim().length > 0);
        case 9: return aiConfidence >= 60;
        default: return false;
      }
    },
    [formData, aiConfidence]
  );

  const completedSteps = STEPS.map((_, i) => isStepComplete(i)).filter(Boolean).length;
  const progressPercent = Math.round((currentStep / (STEPS.length - 1)) * 100);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══════════════════════════════════
          HERO HEADER  (matches SOW repository)
          ═══════════════════════════════════ */}
      <motion.div variants={fadeUp} className="relative" style={{ marginBottom: 24 }}>
        <div className="absolute pointer-events-none" style={{
          top: -60, left: -80, width: 500, height: 300,
          background: 'radial-gradient(ellipse at 20% 40%, rgba(208,176,96,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(91,155,162,0.06) 0%, transparent 45%)',
          filter: 'blur(40px)',
        }} />
        <div className="relative">
          <h1
            className="font-heading leading-[1.15]"
            style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}
          >
            AI SOW Generator
          </h1>
          <p style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-muted)', fontWeight: 400, lineHeight: 1.55 }}>
            Walk through 10 structured steps — our AI crafts a verified Statement of Work from your parameters.
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════
          STEP TIMELINE
          ═══════════════════════════════════ */}
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <div className="flex items-start">
          {STEPS.map((step, idx, arr) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep || (isStepComplete(idx) && idx !== currentStep);
            const StepIcon = step.icon;

            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setCurrentStep(idx)}
                  className="flex flex-col items-center transition-all duration-200"
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer', gap: 6 }}
                >
                  {/* Dot */}
                  <div
                    className="flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      width: isActive ? 32 : 24,
                      height: isActive ? 32 : 24,
                      borderRadius: '50%',
                      background: isActive
                        ? 'linear-gradient(135deg, #A67763, #C4956E)'
                        : isDone
                          ? 'rgba(77,87,65,0.12)'
                          : 'rgba(166,119,99,0.06)',
                      border: `1.5px solid ${
                        isActive
                          ? 'rgba(166,119,99,0.40)'
                          : isDone
                            ? 'rgba(77,87,65,0.25)'
                            : 'rgba(166,119,99,0.12)'
                      }`,
                      boxShadow: isActive ? '0 2px 10px rgba(166,119,99,0.25)' : 'none',
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 style={{ width: 12, height: 12, color: '#4D5741' }} />
                    ) : (
                      <StepIcon style={{
                        width: isActive ? 14 : 11,
                        height: isActive ? 14 : 11,
                        color: isActive ? '#FFFFFF' : 'var(--ink-faint)',
                      }} />
                    )}
                  </div>
                  {/* Label */}
                  <span style={{
                    fontSize: isActive ? 10 : 9,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--ink)' : isDone ? 'var(--ink-muted)' : 'var(--ink-faint)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.2,
                    textAlign: 'center',
                  }}>
                    {step.short}
                  </span>
                </button>
                {/* Connector line */}
                {idx < arr.length - 1 && (
                  <div className="flex items-center shrink-0" style={{ height: isActive || idx + 1 === currentStep ? 32 : 24, paddingTop: 0 }}>
                    <div style={{
                      width: '100%',
                      minWidth: 8,
                      height: 1.5,
                      borderRadius: 1,
                      background: idx < currentStep
                        ? 'rgba(166,119,99,0.28)'
                        : 'rgba(166,119,99,0.08)',
                    }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════
          FORM CARD
          ═══════════════════════════════════ */}
      <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} variants={stepTransition} initial="initial" animate="animate" exit="exit">
            <div className="card-parchment">
              <div className="section-header-parchment">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {STEPS[currentStep].label}
                </div>
              </div>

              <div style={{ padding: '28px 26px' }}>
                {currentStep === 0 && <StepProjectOverview formData={formData} updateField={updateField} />}
                {currentStep === 1 && <StepScopeDefinition formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
                {currentStep === 2 && <StepTechnicalRequirements formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
                {currentStep === 3 && <StepTimelineMilestones formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
                {currentStep === 4 && <StepBudgetParameters formData={formData} updateField={updateField} />}
                {currentStep === 5 && <StepTeamRequirements formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
                {currentStep === 6 && <StepQualityStandards formData={formData} updateField={updateField} />}
                {currentStep === 7 && <StepSecurityCompliance formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
                {currentStep === 8 && <StepRiskParameters formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
                {currentStep === 9 && <StepReviewGenerate formData={formData} aiConfidence={aiConfidence} />}
              </div>

              {/* Navigation footer */}
              <div style={{ padding: '16px 26px 20px', borderTop: '1px solid var(--border-hair)' }}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                    style={{
                      padding: '7px 16px', fontSize: 12, fontWeight: 500,
                      color: currentStep === 0 ? 'var(--ink-faint)' : 'var(--ink-mid)',
                      background: 'transparent',
                      border: `1px solid ${currentStep === 0 ? 'var(--border-hair)' : 'var(--border-soft)'}`,
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentStep === 0 ? 0.5 : 1,
                    }}
                  >
                    <ArrowLeft style={{ width: 12, height: 12 }} /> Back
                  </button>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep((s) => s + 1)}
                      className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                      style={{
                        padding: '7px 16px',
                        background: 'linear-gradient(135deg, #A67763, #886151)',
                        color: '#FFFFFF', fontSize: 12, fontWeight: 500,
                        border: '1px solid rgba(166,119,99,0.30)',
                        boxShadow: '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 3px 12px rgba(166,119,99,0.30), inset 0 1px 0 rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(166,119,99,0.20), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = ''; }}
                    >
                      Continue <ArrowRight style={{ width: 12, height: 12 }} />
                    </button>
                  ) : (
                    <Link href="/enterprise/sow/generate/review">
                      <button
                        className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
                        style={{
                          padding: '8px 20px',
                          background: 'linear-gradient(135deg, #A67763, #886151)',
                          color: '#FFFFFF', fontSize: 12, fontWeight: 600,
                          border: '1px solid rgba(166,119,99,0.30)',
                          boxShadow: '0 2px 10px rgba(166,119,99,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(166,119,99,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(166,119,99,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = ''; }}
                      >
                        <Sparkles style={{ width: 13, height: 13 }} /> Generate SOW
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
}

/* ================================================================
   STEP 0 — Project Overview
   ================================================================ */
function StepProjectOverview({ formData, updateField }: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Start by providing core project identifiers. This grounds the AI and prevents
        generic boilerplate in the generated SOW.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Project Title *</label>
          <Input placeholder="e.g., Enterprise Resource Planning Platform v2.0" value={formData.title} onChange={(e) => updateField("title", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Client / Organization *</label>
          <Input placeholder="e.g., TechVista Solutions" value={formData.client} onChange={(e) => updateField("client", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Industry</label>
          <Select value={formData.industry} onValueChange={(v) => updateField("industry", v)}>
            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology & SaaS</SelectItem>
              <SelectItem value="finance">Finance & Banking</SelectItem>
              <SelectItem value="healthcare">Healthcare & Life Sciences</SelectItem>
              <SelectItem value="retail">Retail & E-commerce</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="education">Education & EdTech</SelectItem>
              <SelectItem value="government">Government & Public Sector</SelectItem>
              <SelectItem value="energy">Energy & Utilities</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Project Type</label>
          <Select value={formData.projectType} onValueChange={(v) => updateField("projectType", v)}>
            <SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="greenfield">Greenfield Development</SelectItem>
              <SelectItem value="migration">System Migration</SelectItem>
              <SelectItem value="modernization">Legacy Modernization</SelectItem>
              <SelectItem value="integration">Integration Project</SelectItem>
              <SelectItem value="mvp">MVP / Proof of Concept</SelectItem>
              <SelectItem value="enhancement">Enhancement / Feature Build</SelectItem>
              <SelectItem value="maintenance">Ongoing Maintenance</SelectItem>
              <SelectItem value="data">Data & Analytics Platform</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TipBox icon={Sparkles} color="teal" title="Why this matters:">
        Specifying industry and project type enables the AI to apply domain-specific templates, compliance requirements, and proven milestone structures.
      </TipBox>
    </div>
  );
}

/* ================================================================
   STEP 1 — Scope Definition
   ================================================================ */
function StepScopeDefinition({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Define what the project should achieve and deliver. Clear scope definition prevents scope creep in the generated SOW.
      </p>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Project Objectives *</label>
        <Textarea placeholder="Describe the primary objectives of this project. What outcomes should it achieve?" value={formData.objectives} onChange={(e) => updateField("objectives", e.target.value)} className="min-h-[100px]" />
      </div>
      <ListField label="Key Deliverables *" items={formData.deliverables} fieldKey="deliverables" placeholder="e.g., User authentication module with OAuth 2.0" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Out of Scope</label>
        <Textarea placeholder="Explicitly state what is NOT included in this project." value={formData.outOfScope} onChange={(e) => updateField("outOfScope", e.target.value)} className="min-h-[80px]" />
      </div>
    </div>
  );
}

/* ================================================================
   STEP 2 — Technical Requirements
   ================================================================ */
function StepTechnicalRequirements({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Specify the technology stack, infrastructure, and third-party integrations. This ensures the AI generates technically viable deliverables.
      </p>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Technology Stack *</label>
        <Textarea placeholder="e.g., React + TypeScript frontend, Node.js/NestJS backend, PostgreSQL, Redis, Docker/K8s" value={formData.techStack} onChange={(e) => updateField("techStack", e.target.value)} className="min-h-[80px]" />
      </div>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Infrastructure & Hosting</label>
        <Select value={formData.infrastructure} onValueChange={(v) => updateField("infrastructure", v)}>
          <SelectTrigger><SelectValue placeholder="Select infrastructure" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
            <SelectItem value="azure">Microsoft Azure</SelectItem>
            <SelectItem value="gcp">Google Cloud Platform</SelectItem>
            <SelectItem value="hybrid">Hybrid Cloud</SelectItem>
            <SelectItem value="on-premise">On-Premise</SelectItem>
            <SelectItem value="multi-cloud">Multi-Cloud</SelectItem>
            <SelectItem value="serverless">Serverless Architecture</SelectItem>
            <SelectItem value="other">Other / TBD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ListField label="Third-Party Integrations" items={formData.integrations} fieldKey="integrations" placeholder="e.g., Stripe Payments API, Salesforce CRM, SendGrid" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} icon={Zap} />
      <TipBox icon={Code2} color="brown" title="AI Hint:">
        Specifying your tech stack helps the AI generate accurate task breakdowns, skill requirements, and realistic effort estimates for each deliverable.
      </TipBox>
    </div>
  );
}

/* ================================================================
   STEP 3 — Timeline & Milestones
   ================================================================ */
function StepTimelineMilestones({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Set the project timeline and define key milestones. The AI uses this to validate feasibility and structure phased delivery.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Start Date *</label>
          <DateInput value={formData.startDate} onChange={(v) => updateField("startDate", v)} placeholder="Select start date" />
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Target End Date *</label>
          <DateInput value={formData.endDate} onChange={(v) => updateField("endDate", v)} placeholder="Select end date" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Phasing Strategy</label>
        <Select value={formData.phasingStrategy} onValueChange={(v) => updateField("phasingStrategy", v)}>
          <SelectTrigger><SelectValue placeholder="Select phasing approach" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="waterfall">Waterfall (Sequential)</SelectItem>
            <SelectItem value="agile-sprints">Agile Sprints (2-week)</SelectItem>
            <SelectItem value="agile-3w">Agile Sprints (3-week)</SelectItem>
            <SelectItem value="kanban">Kanban (Continuous Flow)</SelectItem>
            <SelectItem value="hybrid">Hybrid (Phases + Sprints)</SelectItem>
            <SelectItem value="milestone">Milestone-Driven</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ListField label="Key Milestones" items={formData.milestones} fieldKey="milestones" placeholder="e.g., Phase 1 Complete - Core API & Auth" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} numbered prefix="M" />
    </div>
  );
}

/* ================================================================
   STEP 4 — Budget Parameters
   ================================================================ */
function StepBudgetParameters({ formData, updateField }: { formData: FormData; updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void }) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Define budget range and breakdown preferences. This calibrates the AI to generate appropriately scoped deliverables within your financial constraints.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Budget Minimum</label>
          <Input type="number" placeholder="e.g., 50000" icon={<DollarSign className="w-4 h-4" />} value={formData.budgetMin} onChange={(e) => updateField("budgetMin", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Budget Maximum</label>
          <Input type="number" placeholder="e.g., 150000" icon={<DollarSign className="w-4 h-4" />} value={formData.budgetMax} onChange={(e) => updateField("budgetMax", e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Currency</label>
          <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="AED">AED</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="PKR">PKR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Budget Breakdown Preference</label>
        <Select value={formData.breakdownPreference} onValueChange={(v) => updateField("breakdownPreference", v)}>
          <SelectTrigger><SelectValue placeholder="How should budget be broken down?" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="by-phase">By Phase / Milestone</SelectItem>
            <SelectItem value="by-team">By Team / Role</SelectItem>
            <SelectItem value="by-deliverable">By Deliverable</SelectItem>
            <SelectItem value="fixed-monthly">Fixed Monthly Allocation</SelectItem>
            <SelectItem value="time-materials">Time & Materials</SelectItem>
            <SelectItem value="hybrid">Hybrid (Fixed + T&M)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TipBox icon={DollarSign} color="gold" title="Budget AI:">
        Providing a range instead of a fixed number allows the AI to optimize scope across high/medium/low priority deliverables and flag budget-risk items.
      </TipBox>
    </div>
  );
}

/* ================================================================
   STEP 5 — Team Requirements
   ================================================================ */
function StepTeamRequirements({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Specify the team structure, roles, and skill preferences. This powers the AI&apos;s Instant Team Formation engine for optimal contributor matching.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Estimated Team Size</label>
          <Select value={formData.teamSize} onValueChange={(v) => updateField("teamSize", v)}>
            <SelectTrigger><SelectValue placeholder="Select team size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">Micro (1-3 contributors)</SelectItem>
              <SelectItem value="4-8">Small (4-8 contributors)</SelectItem>
              <SelectItem value="9-15">Medium (9-15 contributors)</SelectItem>
              <SelectItem value="16-30">Large (16-30 contributors)</SelectItem>
              <SelectItem value="30+">Enterprise (30+ contributors)</SelectItem>
              <SelectItem value="auto">Auto (AI Recommended)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Work Model</label>
          <Select value={formData.workModel} onValueChange={(v) => updateField("workModel", v)}>
            <SelectTrigger><SelectValue placeholder="Select work model" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fully-remote">Fully Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="on-site">On-Site</SelectItem>
              <SelectItem value="flexible">Flexible / Async</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ListField label="Required Roles *" items={formData.roles} fieldKey="roles" placeholder="e.g., Senior React Developer, DevOps Engineer" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} addLabel="Add Role" icon={Users} />
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Skill Priorities & Preferences</label>
        <Textarea placeholder="e.g., Must have TypeScript expertise, prefer contributors with fintech experience" value={formData.skillPriorities} onChange={(e) => updateField("skillPriorities", e.target.value)} className="min-h-[80px]" />
      </div>
    </div>
  );
}

/* ================================================================
   STEP 6 — Quality Standards
   ================================================================ */
function StepQualityStandards({ formData, updateField }: { formData: FormData; updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void }) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Define acceptance criteria, SLA targets, and quality gates. These become enforceable checkpoints in the generated SOW and feed into APG governance.
      </p>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Acceptance Criteria *</label>
        <Textarea placeholder="Describe what constitutes acceptable delivery. e.g., code coverage > 80%, WCAG 2.1 AA" value={formData.acceptanceCriteria} onChange={(e) => updateField("acceptanceCriteria", e.target.value)} className="min-h-[100px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>SLA / Uptime Target</label>
          <Select value={formData.slaUptime} onValueChange={(v) => updateField("slaUptime", v)}>
            <SelectTrigger><SelectValue placeholder="Select SLA target" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="99.9">99.9% (Three Nines)</SelectItem>
              <SelectItem value="99.95">99.95%</SelectItem>
              <SelectItem value="99.99">99.99% (Four Nines)</SelectItem>
              <SelectItem value="best-effort">Best Effort</SelectItem>
              <SelectItem value="na">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Testing Requirements</label>
          <Select value={formData.testingRequirements} onValueChange={(v) => updateField("testingRequirements", v)}>
            <SelectTrigger><SelectValue placeholder="Select testing level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unit">Unit Tests Only</SelectItem>
              <SelectItem value="unit-integration">Unit + Integration</SelectItem>
              <SelectItem value="full">Full (Unit + Integration + E2E)</SelectItem>
              <SelectItem value="full-perf">Full + Performance Testing</SelectItem>
              <SelectItem value="full-security">Full + Security Testing</SelectItem>
              <SelectItem value="comprehensive">Comprehensive (All Types)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Code Review Policy</label>
        <Select value={formData.codeReviewPolicy} onValueChange={(v) => updateField("codeReviewPolicy", v)}>
          <SelectTrigger><SelectValue placeholder="Select code review approach" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="peer">Peer Review (1 reviewer)</SelectItem>
            <SelectItem value="senior">Senior Review Required</SelectItem>
            <SelectItem value="two-reviewers">Two Reviewers Required</SelectItem>
            <SelectItem value="mentor-review">Mentor-Guided Review (APG)</SelectItem>
            <SelectItem value="ai-assisted">AI-Assisted + Human Review</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TipBox icon={ShieldCheck} color="forest" title="Quality Gates:">
        These criteria will be embedded as automated quality gates in the APG, ensuring every deliverable meets your standards before acceptance.
      </TipBox>
    </div>
  );
}

/* ================================================================
   STEP 7 — Security & Compliance
   ================================================================ */
function StepSecurityCompliance({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Specify data sensitivity levels and regulatory requirements. The AI will embed compliance clauses and security provisions into the generated SOW.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Data Sensitivity Level *</label>
          <Select value={formData.dataSensitivity} onValueChange={(v) => updateField("dataSensitivity", v)}>
            <SelectTrigger><SelectValue placeholder="Select sensitivity level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public Data</SelectItem>
              <SelectItem value="internal">Internal / Confidential</SelectItem>
              <SelectItem value="sensitive">Sensitive (PII/PHI)</SelectItem>
              <SelectItem value="restricted">Restricted / Top Secret</SelectItem>
              <SelectItem value="regulated">Regulated Industry Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Encryption Requirements</label>
          <Select value={formData.encryptionRequirements} onValueChange={(v) => updateField("encryptionRequirements", v)}>
            <SelectTrigger><SelectValue placeholder="Select encryption level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (TLS 1.2+)</SelectItem>
              <SelectItem value="enhanced">Enhanced (TLS 1.3 + AES-256)</SelectItem>
              <SelectItem value="e2e">End-to-End Encryption</SelectItem>
              <SelectItem value="fips">FIPS 140-2 Compliant</SelectItem>
              <SelectItem value="custom">Custom Requirements</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ListField label="Regulatory Frameworks" items={formData.regulations} fieldKey="regulations" placeholder="e.g., GDPR, SOC 2 Type II, HIPAA, PCI-DSS" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} icon={ShieldCheck} />
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Access Control Model</label>
        <Select value={formData.accessControl} onValueChange={(v) => updateField("accessControl", v)}>
          <SelectTrigger><SelectValue placeholder="Select access control approach" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rbac">Role-Based (RBAC)</SelectItem>
            <SelectItem value="abac">Attribute-Based (ABAC)</SelectItem>
            <SelectItem value="zero-trust">Zero Trust Architecture</SelectItem>
            <SelectItem value="mfa-required">MFA Required for All Users</SelectItem>
            <SelectItem value="sso">SSO / Federated Identity</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 8 — Risk Parameters
   ================================================================ */
function StepRiskParameters({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Identify known risks and constraints. The AI will generate mitigation strategies and contingency clauses based on your risk profile.
      </p>
      <ListField label="Known Risks *" items={formData.knownRisks} fieldKey="knownRisks" placeholder="e.g., Third-party API dependency may have rate limits" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} addLabel="Add Risk" icon={AlertTriangle} />
      <div>
        <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Project Constraints</label>
        <Textarea placeholder="e.g., Must not exceed 6-month timeline, limited to approved vendor list" value={formData.constraints} onChange={(e) => updateField("constraints", e.target.value)} className="min-h-[80px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Contingency Budget (%)</label>
          <Select value={formData.contingencyBudget} onValueChange={(v) => updateField("contingencyBudget", v)}>
            <SelectTrigger><SelectValue placeholder="Select contingency %" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5% of total budget</SelectItem>
              <SelectItem value="10">10% of total budget</SelectItem>
              <SelectItem value="15">15% of total budget</SelectItem>
              <SelectItem value="20">20% of total budget</SelectItem>
              <SelectItem value="custom">Custom Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>Escalation Process</label>
          <Select value={formData.escalationProcess} onValueChange={(v) => updateField("escalationProcess", v)}>
            <SelectTrigger><SelectValue placeholder="Select escalation model" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tiered">{"Tiered (L1 → L2 → L3)"}</SelectItem>
              <SelectItem value="direct">Direct to Stakeholder</SelectItem>
              <SelectItem value="committee">Steering Committee</SelectItem>
              <SelectItem value="apg-governed">APG-Governed Auto-Escalation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TipBox icon={AlertTriangle} color="gold" title="Risk AI:">
        The more risks you identify upfront, the better the AI can generate targeted mitigation strategies and realistic contingency plans in the SOW.
      </TipBox>
    </div>
  );
}

/* ================================================================
   STEP 9 — Review & Generate
   ================================================================ */
function StepReviewGenerate({ formData, aiConfidence }: {
  formData: FormData; aiConfidence: number;
}) {
  const filledCount = [
    formData.title.trim().length > 0,
    formData.client.trim().length > 0,
    formData.industry.length > 0,
    formData.objectives.trim().length > 0,
    formData.deliverables.some((d) => d.trim().length > 0),
    formData.techStack.trim().length > 0,
    formData.startDate.length > 0 && formData.endDate.length > 0,
    formData.budgetMin.length > 0 || formData.budgetMax.length > 0,
    formData.roles.some((r) => r.trim().length > 0),
    formData.dataSensitivity.length > 0,
    formData.knownRisks.some((r) => r.trim().length > 0),
  ].filter(Boolean).length;

  const formatDate = (v: string) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const summaryRows = [
    { label: "Project", value: formData.title || "—", filled: formData.title.trim().length > 0 },
    { label: "Client", value: formData.client || "—", filled: formData.client.trim().length > 0 },
    { label: "Industry", value: formData.industry ? formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1) : "—", filled: formData.industry.length > 0 },
    { label: "Objectives", value: formData.objectives ? formData.objectives.slice(0, 80) + (formData.objectives.length > 80 ? "…" : "") : "—", filled: formData.objectives.trim().length > 0 },
    { label: "Deliverables", value: formData.deliverables.filter((d) => d.trim()).length ? `${formData.deliverables.filter((d) => d.trim()).length} defined` : "—", filled: formData.deliverables.some((d) => d.trim().length > 0) },
    { label: "Tech Stack", value: formData.techStack ? formData.techStack.slice(0, 60) + (formData.techStack.length > 60 ? "…" : "") : "—", filled: formData.techStack.trim().length > 0 },
    { label: "Timeline", value: formData.startDate && formData.endDate ? `${formatDate(formData.startDate)} → ${formatDate(formData.endDate)}` : "—", filled: formData.startDate.length > 0 && formData.endDate.length > 0 },
    { label: "Budget", value: formData.budgetMin || formData.budgetMax ? `${formData.currency} ${formData.budgetMin || "?"} – ${formData.budgetMax || "?"}` : "—", filled: formData.budgetMin.length > 0 || formData.budgetMax.length > 0 },
    { label: "Team", value: formData.roles.filter((r) => r.trim()).length ? `${formData.roles.filter((r) => r.trim()).length} roles, ${formData.teamSize || "auto"} size` : "—", filled: formData.roles.some((r) => r.trim().length > 0) },
    { label: "Security", value: formData.dataSensitivity ? formData.dataSensitivity.charAt(0).toUpperCase() + formData.dataSensitivity.slice(1) : "—", filled: formData.dataSensitivity.length > 0 },
    { label: "Risks", value: formData.knownRisks.filter((r) => r.trim()).length ? `${formData.knownRisks.filter((r) => r.trim()).length} identified` : "—", filled: formData.knownRisks.some((r) => r.trim().length > 0) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
        Review your inputs below. Click Generate SOW when ready.
      </p>

      {/* Confidence line */}
      <div className="flex items-center justify-between" style={{
        padding: '10px 16px', borderRadius: 8,
        background: aiConfidence >= 70 ? 'rgba(77,87,65,0.05)' : aiConfidence >= 40 ? 'rgba(208,176,96,0.05)' : 'rgba(166,119,99,0.04)',
        border: `1px solid ${aiConfidence >= 70 ? 'rgba(77,87,65,0.14)' : aiConfidence >= 40 ? 'rgba(208,176,96,0.18)' : 'rgba(166,119,99,0.14)'}`,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: aiConfidence >= 70 ? '#344028' : aiConfidence >= 40 ? '#7A6030' : '#6A4C3F' }}>
          {aiConfidence >= 70 ? "High Confidence" : aiConfidence >= 40 ? "Moderate Confidence" : "Low Confidence"}
        </span>
        <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
          {filledCount} of {summaryRows.length} fields · {aiConfidence}%
        </span>
      </div>

      {/* Summary rows */}
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
        {summaryRows.map((row, idx) => (
          <div key={row.label} className="flex items-center" style={{
            padding: '9px 16px',
            background: idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(249,245,241,0.25)',
            borderBottom: idx < summaryRows.length - 1 ? '1px solid var(--border-hair)' : 'none',
            gap: 10,
          }}>
            {row.filled
              ? <CheckCircle2 className="shrink-0" style={{ width: 13, height: 13, color: '#4D5741' }} />
              : <div className="shrink-0" style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid var(--border-soft)' }} />
            }
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)', width: 88, flexShrink: 0 }}>{row.label}</span>
            <span className="truncate" style={{ fontSize: 12, color: row.filled ? 'var(--ink)' : 'var(--ink-faint)' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SHARED HELPERS — TipBox, ListField
   ════════════════════════════════════════════════════════════════ */

interface StepListProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}

const tipColors = {
  teal:   { bg: 'rgba(91,155,162,0.06)', border: 'rgba(91,155,162,0.16)', icon: '#3A6368', text: '#2A6068' },
  brown:  { bg: 'rgba(166,119,99,0.05)', border: 'rgba(166,119,99,0.14)', icon: '#A67763', text: 'var(--ink-mid)' },
  gold:   { bg: 'rgba(208,176,96,0.06)', border: 'rgba(208,176,96,0.16)', icon: '#86713D', text: '#7A6030' },
  forest: { bg: 'rgba(77,87,65,0.06)',    border: 'rgba(77,87,65,0.14)',    icon: '#4D5741', text: '#3F4735' },
};

function TipBox({ icon: Icon, color, title, children }: {
  icon: React.ElementType; color: keyof typeof tipColors; title: string; children: React.ReactNode;
}) {
  const c = tipColors[color];
  return (
    <div className="rounded-xl" style={{ padding: 16, background: c.bg, border: `1px solid ${c.border}` }}>
      <div className="flex items-start gap-2.5">
        <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: c.icon }} />
        <p style={{ fontSize: 12, color: c.text, lineHeight: 1.65 }}>
          <span className="font-semibold">{title}</span> {children}
        </p>
      </div>
    </div>
  );
}

function ListField({ label, items, fieldKey, placeholder, addListItem, removeListItem, updateListItem, addLabel = "Add", icon: Icon, numbered, prefix }: {
  label: string; items: string[]; fieldKey: keyof FormData; placeholder: string;
  addListItem: (key: keyof FormData) => void; removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
  addLabel?: string; icon?: React.ElementType; numbered?: boolean; prefix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mid)' }}>{label}</label>
        <button onClick={() => addListItem(fieldKey)} className="inline-flex items-center gap-1 transition-colors" style={{ fontSize: 12, fontWeight: 600, color: '#3A6368' }}>
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(166,119,99,0.06)' }}>
              {Icon ? <Icon className="w-3 h-3" style={{ color: 'var(--ink-faint)' }} /> : (
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)' }}>{prefix ? `${prefix}${idx + 1}` : idx + 1}</span>
              )}
            </div>
            <Input placeholder={placeholder} value={item} onChange={(e) => updateListItem(fieldKey, idx, e.target.value)} className="h-9 text-[13px]" />
            {items.length > 1 && (
              <button onClick={() => removeListItem(fieldKey, idx)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0" style={{ color: 'var(--ink-faint)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
