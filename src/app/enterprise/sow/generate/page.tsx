"use client";

import * as React from "react";
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
  Cpu,
  Layers,
  Globe,
  Zap,
  Eye,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Progress,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";

/* ────────────────────────────────────────────────────────────
   Step definitions
   ──────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────────
   Hallucination prevention layers
   ──────────────────────────────────────────────────────────── */
const HALLUCINATION_LAYERS = [
  { name: "Context Grounding", step: 0 },
  { name: "Scope Anchoring", step: 1 },
  { name: "Tech Validation", step: 2 },
  { name: "Timeline Feasibility", step: 3 },
  { name: "Budget Calibration", step: 4 },
  { name: "Resource Mapping", step: 5 },
  { name: "Compliance Check", step: 7 },
  { name: "Risk Correlation", step: 8 },
];

/* ────────────────────────────────────────────────────────────
   Form data interface
   ──────────────────────────────────────────────────────────── */
interface FormData {
  // Step 0 — Project Overview
  title: string;
  client: string;
  industry: string;
  projectType: string;
  // Step 1 — Scope Definition
  objectives: string;
  deliverables: string[];
  outOfScope: string;
  // Step 2 — Technical Requirements
  techStack: string;
  infrastructure: string;
  integrations: string[];
  // Step 3 — Timeline & Milestones
  startDate: string;
  endDate: string;
  milestones: string[];
  phasingStrategy: string;
  // Step 4 — Budget Parameters
  budgetMin: string;
  budgetMax: string;
  currency: string;
  breakdownPreference: string;
  // Step 5 — Team Requirements
  teamSize: string;
  roles: string[];
  skillPriorities: string;
  workModel: string;
  // Step 6 — Quality Standards
  acceptanceCriteria: string;
  slaUptime: string;
  testingRequirements: string;
  codeReviewPolicy: string;
  // Step 7 — Security & Compliance
  dataSensitivity: string;
  regulations: string[];
  encryptionRequirements: string;
  accessControl: string;
  // Step 8 — Risk Parameters
  knownRisks: string[];
  constraints: string;
  contingencyBudget: string;
  escalationProcess: string;
}

const initialFormData: FormData = {
  title: "",
  client: "",
  industry: "",
  projectType: "",
  objectives: "",
  deliverables: [""],
  outOfScope: "",
  techStack: "",
  infrastructure: "",
  integrations: [""],
  startDate: "",
  endDate: "",
  milestones: [""],
  phasingStrategy: "",
  budgetMin: "",
  budgetMax: "",
  currency: "USD",
  breakdownPreference: "",
  teamSize: "",
  roles: [""],
  skillPriorities: "",
  workModel: "",
  acceptanceCriteria: "",
  slaUptime: "",
  testingRequirements: "",
  codeReviewPolicy: "",
  dataSensitivity: "",
  regulations: [""],
  encryptionRequirements: "",
  accessControl: "",
  knownRisks: [""],
  constraints: "",
  contingencyBudget: "",
  escalationProcess: "",
};

/* ────────────────────────────────────────────────────────────
   Step transition animation
   ──────────────────────────────────────────────────────────── */
const stepTransition = {
  initial: { opacity: 0, x: 40, scale: 0.98 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.98,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ────────────────────────────────────────────────────────────
   Main page component
   ──────────────────────────────────────────────────────────── */
export default function SOWGenerateWizardPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);

  /* ── Helpers ── */
  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addListItem = (key: keyof FormData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] as string[]), ""],
    }));
  };

  const removeListItem = (key: keyof FormData, idx: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((_, i) => i !== idx),
    }));
  };

  const updateListItem = (key: keyof FormData, idx: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).map((item, i) => (i === idx ? value : item)),
    }));
  };

  /* ── Confidence calculation ── */
  const calculateConfidence = React.useCallback(() => {
    const fieldChecks: boolean[] = [
      // Step 0
      formData.title.trim().length > 0,
      formData.client.trim().length > 0,
      formData.industry.length > 0,
      formData.projectType.length > 0,
      // Step 1
      formData.objectives.trim().length > 0,
      formData.deliverables.some((d) => d.trim().length > 0),
      formData.outOfScope.trim().length > 0,
      // Step 2
      formData.techStack.trim().length > 0,
      formData.infrastructure.length > 0,
      formData.integrations.some((i) => i.trim().length > 0),
      // Step 3
      formData.startDate.length > 0,
      formData.endDate.length > 0,
      formData.milestones.some((m) => m.trim().length > 0),
      formData.phasingStrategy.length > 0,
      // Step 4
      formData.budgetMin.length > 0,
      formData.budgetMax.length > 0,
      formData.breakdownPreference.length > 0,
      // Step 5
      formData.teamSize.length > 0,
      formData.roles.some((r) => r.trim().length > 0),
      formData.workModel.length > 0,
      // Step 6
      formData.acceptanceCriteria.trim().length > 0,
      formData.slaUptime.length > 0,
      formData.testingRequirements.length > 0,
      // Step 7
      formData.dataSensitivity.length > 0,
      formData.regulations.some((r) => r.trim().length > 0),
      formData.encryptionRequirements.length > 0,
      // Step 8
      formData.knownRisks.some((r) => r.trim().length > 0),
      formData.constraints.trim().length > 0,
      formData.contingencyBudget.length > 0,
    ];

    const filled = fieldChecks.filter(Boolean).length;
    return Math.round((filled / fieldChecks.length) * 100);
  }, [formData]);

  const aiConfidence = calculateConfidence();

  /* ── Step completion check ── */
  const isStepComplete = React.useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0:
          return formData.title.trim().length > 0 && formData.client.trim().length > 0;
        case 1:
          return formData.objectives.trim().length > 0 && formData.deliverables.some((d) => d.trim().length > 0);
        case 2:
          return formData.techStack.trim().length > 0;
        case 3:
          return formData.startDate.length > 0 && formData.endDate.length > 0;
        case 4:
          return formData.budgetMin.length > 0 || formData.budgetMax.length > 0;
        case 5:
          return formData.roles.some((r) => r.trim().length > 0);
        case 6:
          return formData.acceptanceCriteria.trim().length > 0;
        case 7:
          return formData.dataSensitivity.length > 0;
        case 8:
          return formData.knownRisks.some((r) => r.trim().length > 0);
        case 9:
          return aiConfidence >= 60;
        default:
          return false;
      }
    },
    [formData, aiConfidence]
  );

  const completedSteps = STEPS.map((_, i) => isStepComplete(i)).filter(Boolean).length;
  const progressPercent = Math.round((currentStep / (STEPS.length - 1)) * 100);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1400px] mx-auto space-y-6"
    >
      {/* ── Back Link ── */}
      <motion.div variants={fadeUp}>
        <Link
          href="/enterprise/sow/intake"
          className="inline-flex items-center gap-2 text-sm text-beige-600 hover:text-brown-700 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to SOW Intake
        </Link>
      </motion.div>

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center shadow-lg shadow-brown-500/20 shrink-0">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brown-900 tracking-tight font-heading">
            AI SOW Generator
          </h1>
          <p className="text-sm text-beige-600 mt-0.5">
            Walk through 10 structured steps and let our AI craft a comprehensive,
            hallucination-free Statement of Work from your parameters.
          </p>
        </div>
      </motion.div>

      {/* ── Top Progress Bar ── */}
      <motion.div variants={fadeUp} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-beige-500">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-[12px] font-mono font-semibold text-brown-700">
            {progressPercent}%
          </span>
        </div>
        <Progress value={progressPercent} variant="gradient-brown" size="sm" />
      </motion.div>

      {/* ── Step Indicator Bar ── */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isComplete = isStepComplete(idx) && idx !== currentStep;
              const isPast = idx < currentStep;
              const StepIcon = step.icon;

              return (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => setCurrentStep(idx)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group shrink-0",
                      isActive
                        ? "bg-gradient-to-r from-brown-500 to-brown-600 text-white shadow-md shadow-brown-500/20"
                        : isComplete
                          ? "bg-forest-50 text-forest-700 hover:bg-forest-100"
                          : isPast
                            ? "bg-beige-100 text-brown-600 hover:bg-beige-200"
                            : "bg-transparent text-beige-400 hover:bg-beige-50 hover:text-beige-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all",
                        isActive
                          ? "bg-white/20 text-white"
                          : isComplete
                            ? "bg-forest-500 text-white"
                            : isPast
                              ? "bg-brown-200 text-brown-600"
                              : "bg-beige-200 text-beige-400"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-[12px] font-semibold hidden lg:block">
                      {step.short}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "w-4 h-px shrink-0 transition-colors",
                        idx < currentStep ? "bg-brown-300" : "bg-beige-200"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Main Grid: Step Content + Sidebar ── */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Left: Step Form (3/4 width) ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-8">
                  {/* Step Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        "bg-gradient-to-br from-brown-100 to-beige-100"
                      )}
                    >
                      {React.createElement(STEPS[currentStep].icon, {
                        className: "w-5 h-5 text-brown-600",
                      })}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-beige-400 uppercase tracking-widest">
                        Step {currentStep + 1} of {STEPS.length}
                      </p>
                      <h2 className="text-lg font-bold text-brown-900 font-heading">
                        {STEPS[currentStep].label}
                      </h2>
                    </div>
                  </div>

                  {/* ── Step Content ── */}
                  {currentStep === 0 && (
                    <StepProjectOverview
                      formData={formData}
                      updateField={updateField}
                    />
                  )}
                  {currentStep === 1 && (
                    <StepScopeDefinition
                      formData={formData}
                      updateField={updateField}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                      updateListItem={updateListItem}
                    />
                  )}
                  {currentStep === 2 && (
                    <StepTechnicalRequirements
                      formData={formData}
                      updateField={updateField}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                      updateListItem={updateListItem}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepTimelineMilestones
                      formData={formData}
                      updateField={updateField}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                      updateListItem={updateListItem}
                    />
                  )}
                  {currentStep === 4 && (
                    <StepBudgetParameters
                      formData={formData}
                      updateField={updateField}
                    />
                  )}
                  {currentStep === 5 && (
                    <StepTeamRequirements
                      formData={formData}
                      updateField={updateField}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                      updateListItem={updateListItem}
                    />
                  )}
                  {currentStep === 6 && (
                    <StepQualityStandards
                      formData={formData}
                      updateField={updateField}
                    />
                  )}
                  {currentStep === 7 && (
                    <StepSecurityCompliance
                      formData={formData}
                      updateField={updateField}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                      updateListItem={updateListItem}
                    />
                  )}
                  {currentStep === 8 && (
                    <StepRiskParameters
                      formData={formData}
                      updateField={updateField}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                      updateListItem={updateListItem}
                    />
                  )}
                  {currentStep === 9 && (
                    <StepReviewGenerate
                      formData={formData}
                      aiConfidence={aiConfidence}
                      isStepComplete={isStepComplete}
                    />
                  )}

                  {/* ── Navigation Buttons ── */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-beige-200/50">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                      disabled={currentStep === 0}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentStep < STEPS.length - 1 && (
                        <button
                          onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
                          className="text-[12px] font-semibold text-beige-500 hover:text-brown-600 transition-colors mr-2"
                        >
                          Skip
                        </button>
                      )}

                      {currentStep < STEPS.length - 1 ? (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => setCurrentStep((s) => s + 1)}
                          className="gap-2"
                        >
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Link href="/enterprise/sow/generate/review">
                          <Button
                            variant="gradient-primary"
                            size="lg"
                            className="gap-2 shadow-lg shadow-brown-500/20"
                          >
                            <Sparkles className="w-4 h-4" />
                            Generate SOW
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-5">
              {/* AI Confidence Ring */}
              <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                    <BrainCircuit className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-[13px] font-bold text-brown-900">
                    AI Confidence
                  </h3>
                </div>

                <div className="flex justify-center mb-3">
                  <MetricRing
                    value={aiConfidence}
                    size={100}
                    strokeWidth={8}
                    color={
                      aiConfidence >= 80
                        ? "forest"
                        : aiConfidence >= 50
                          ? "teal"
                          : aiConfidence >= 25
                            ? "gold"
                            : "brown"
                    }
                    label="Confidence"
                  />
                </div>

                <p className="text-[11px] text-beige-500 text-center leading-relaxed">
                  {aiConfidence < 30
                    ? "Add more details to improve generation quality."
                    : aiConfidence < 60
                      ? "Good start. Fill more steps for better accuracy."
                      : aiConfidence < 80
                        ? "Strong foundation. A few more fields will maximize quality."
                        : "Excellent! AI has enough context for high-quality generation."}
                </p>
              </div>

              {/* Hallucination Prevention */}
              <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-[13px] font-bold text-brown-900">
                    Hallucination Prevention
                  </h3>
                </div>

                <div className="space-y-2">
                  {HALLUCINATION_LAYERS.map((layer) => {
                    const isActive = isStepComplete(layer.step);
                    return (
                      <div
                        key={layer.name}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300",
                          isActive
                            ? "bg-forest-50 border border-forest-100"
                            : "bg-beige-50/50 border border-transparent"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                            isActive ? "bg-forest-500" : "bg-beige-200"
                          )}
                        >
                          {isActive && (
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-semibold transition-colors",
                            isActive ? "text-forest-700" : "text-beige-400"
                          )}
                        >
                          {layer.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-beige-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-beige-500">Layers active</span>
                    <Badge
                      variant={
                        HALLUCINATION_LAYERS.filter((l) => isStepComplete(l.step)).length >= 6
                          ? "forest"
                          : "beige"
                      }
                      className="text-[10px]"
                    >
                      {HALLUCINATION_LAYERS.filter((l) => isStepComplete(l.step)).length} / {HALLUCINATION_LAYERS.length}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Steps Completion Summary */}
              <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6">
                <h3 className="text-[13px] font-bold text-brown-900 mb-3">
                  Steps Progress
                </h3>
                <div className="space-y-1.5">
                  {STEPS.map((step, idx) => {
                    const complete = isStepComplete(idx);
                    const isCurrent = idx === currentStep;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={cn(
                          "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-left transition-all",
                          isCurrent
                            ? "bg-brown-50 border border-brown-200/60"
                            : "hover:bg-beige-50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold",
                            complete
                              ? "bg-forest-500 text-white"
                              : isCurrent
                                ? "bg-brown-500 text-white"
                                : "bg-beige-200 text-beige-400"
                          )}
                        >
                          {complete ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-medium truncate",
                            complete
                              ? "text-forest-700"
                              : isCurrent
                                ? "text-brown-800"
                                : "text-beige-500"
                          )}
                        >
                          {step.short}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-beige-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-beige-500">Completed</span>
                    <span className="text-[12px] font-bold text-brown-700">
                      {completedSteps} / {STEPS.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   STEP 0 — Project Overview
   ================================================================ */
function StepProjectOverview({
  formData,
  updateField,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Start by providing core project identifiers. This grounds the AI and prevents
        generic boilerplate in the generated SOW.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Project Title *
          </Label>
          <Input
            placeholder="e.g., Enterprise Resource Planning Platform v2.0"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Client / Organization *
          </Label>
          <Input
            placeholder="e.g., TechVista Solutions"
            value={formData.client}
            onChange={(e) => updateField("client", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Industry
          </Label>
          <Select
            value={formData.industry}
            onValueChange={(v) => updateField("industry", v)}
          >
            <SelectTrigger>
              <Globe className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
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
        <div className="md:col-span-2">
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Project Type
          </Label>
          <Select
            value={formData.projectType}
            onValueChange={(v) => updateField("projectType", v)}
          >
            <SelectTrigger>
              <Layers className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
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

      {/* Inline tip */}
      <div className="rounded-xl bg-gradient-to-r from-teal-50 to-beige-50 border border-teal-100/60 p-4">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-teal-700 leading-relaxed">
            <span className="font-semibold">Why this matters:</span> Specifying industry and
            project type enables the AI to apply domain-specific templates, compliance
            requirements, and proven milestone structures.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 1 — Scope Definition
   ================================================================ */
function StepScopeDefinition({
  formData,
  updateField,
  addListItem,
  removeListItem,
  updateListItem,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Define what the project should achieve and deliver. Clear scope definition
        prevents scope creep in the generated SOW.
      </p>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Project Objectives *
        </Label>
        <Textarea
          placeholder="Describe the primary objectives of this project. What outcomes should it achieve? What problems does it solve?"
          value={formData.objectives}
          onChange={(e) => updateField("objectives", e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Deliverables list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[12px] font-semibold text-brown-800">
            Key Deliverables *
          </Label>
          <button
            onClick={() => addListItem("deliverables")}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.deliverables.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-beige-100 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-beige-500">
                  {idx + 1}
                </span>
              </div>
              <Input
                placeholder="e.g., User authentication module with OAuth 2.0"
                value={item}
                onChange={(e) => updateListItem("deliverables", idx, e.target.value)}
                className="h-9 text-[13px]"
              />
              {formData.deliverables.length > 1 && (
                <button
                  onClick={() => removeListItem("deliverables", idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-beige-400 hover:text-brown-600 hover:bg-beige-100 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Out of Scope
        </Label>
        <Textarea
          placeholder="Explicitly state what is NOT included in this project. This helps the AI generate clear boundaries."
          value={formData.outOfScope}
          onChange={(e) => updateField("outOfScope", e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

/* ================================================================
   STEP 2 — Technical Requirements
   ================================================================ */
function StepTechnicalRequirements({
  formData,
  updateField,
  addListItem,
  removeListItem,
  updateListItem,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Specify the technology stack, infrastructure, and third-party integrations.
        This ensures the AI generates technically viable deliverables.
      </p>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Technology Stack *
        </Label>
        <Textarea
          placeholder="e.g., React + TypeScript frontend, Node.js/NestJS backend, PostgreSQL database, Redis caching, Docker/Kubernetes deployment"
          value={formData.techStack}
          onChange={(e) => updateField("techStack", e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Infrastructure & Hosting
        </Label>
        <Select
          value={formData.infrastructure}
          onValueChange={(v) => updateField("infrastructure", v)}
        >
          <SelectTrigger>
            <Cpu className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
            <SelectValue placeholder="Select infrastructure" />
          </SelectTrigger>
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

      {/* Integrations list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[12px] font-semibold text-brown-800">
            Third-Party Integrations
          </Label>
          <button
            onClick={() => addListItem("integrations")}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.integrations.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center shrink-0">
                <Zap className="w-3 h-3 text-teal-500" />
              </div>
              <Input
                placeholder="e.g., Stripe Payments API, Salesforce CRM, SendGrid"
                value={item}
                onChange={(e) => updateListItem("integrations", idx, e.target.value)}
                className="h-9 text-[13px]"
              />
              {formData.integrations.length > 1 && (
                <button
                  onClick={() => removeListItem("integrations", idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-beige-400 hover:text-brown-600 hover:bg-beige-100 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tech tip */}
      <div className="rounded-xl bg-gradient-to-r from-brown-50 to-beige-50 border border-brown-100/60 p-4">
        <div className="flex items-start gap-2.5">
          <Code2 className="w-4 h-4 text-brown-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-brown-700 leading-relaxed">
            <span className="font-semibold">AI Hint:</span> Specifying your tech stack
            helps the AI generate accurate task breakdowns, skill requirements, and
            realistic effort estimates for each deliverable.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 3 — Timeline & Milestones
   ================================================================ */
function StepTimelineMilestones({
  formData,
  updateField,
  addListItem,
  removeListItem,
  updateListItem,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Set the project timeline and define key milestones. The AI uses this to
        validate feasibility and structure phased delivery.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Start Date *
          </Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Target End Date *
          </Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Phasing Strategy
        </Label>
        <Select
          value={formData.phasingStrategy}
          onValueChange={(v) => updateField("phasingStrategy", v)}
        >
          <SelectTrigger>
            <Layers className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
            <SelectValue placeholder="Select phasing approach" />
          </SelectTrigger>
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

      {/* Milestones list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[12px] font-semibold text-brown-800">
            Key Milestones
          </Label>
          <button
            onClick={() => addListItem("milestones")}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.milestones.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gold-50 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-gold-600">
                  M{idx + 1}
                </span>
              </div>
              <Input
                placeholder="e.g., Phase 1 Complete - Core API & Auth"
                value={item}
                onChange={(e) => updateListItem("milestones", idx, e.target.value)}
                className="h-9 text-[13px]"
              />
              {formData.milestones.length > 1 && (
                <button
                  onClick={() => removeListItem("milestones", idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-beige-400 hover:text-brown-600 hover:bg-beige-100 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 4 — Budget Parameters
   ================================================================ */
function StepBudgetParameters({
  formData,
  updateField,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Define budget range and breakdown preferences. This calibrates the AI to
        generate appropriately scoped deliverables within your financial constraints.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Budget Minimum
          </Label>
          <Input
            type="number"
            placeholder="e.g., 50000"
            icon={<DollarSign className="w-4 h-4" />}
            value={formData.budgetMin}
            onChange={(e) => updateField("budgetMin", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Budget Maximum
          </Label>
          <Input
            type="number"
            placeholder="e.g., 150000"
            icon={<DollarSign className="w-4 h-4" />}
            value={formData.budgetMax}
            onChange={(e) => updateField("budgetMax", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Currency
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(v) => updateField("currency", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (&euro;)</SelectItem>
              <SelectItem value="GBP">GBP (&pound;)</SelectItem>
              <SelectItem value="AED">AED (AED)</SelectItem>
              <SelectItem value="INR">INR (&rupee;)</SelectItem>
              <SelectItem value="PKR">PKR (PKR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Budget Breakdown Preference
        </Label>
        <Select
          value={formData.breakdownPreference}
          onValueChange={(v) => updateField("breakdownPreference", v)}
        >
          <SelectTrigger>
            <Layers className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
            <SelectValue placeholder="How should budget be broken down?" />
          </SelectTrigger>
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

      {/* Budget insight */}
      <div className="rounded-xl bg-gradient-to-r from-gold-50 to-beige-50 border border-gold-100/60 p-4">
        <div className="flex items-start gap-2.5">
          <DollarSign className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-gold-700 leading-relaxed">
            <span className="font-semibold">Budget AI:</span> Providing a range instead
            of a fixed number allows the AI to optimize scope across high/medium/low
            priority deliverables and flag budget-risk items.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 5 — Team Requirements
   ================================================================ */
function StepTeamRequirements({
  formData,
  updateField,
  addListItem,
  removeListItem,
  updateListItem,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Specify the team structure, roles, and skill preferences. This powers the
        AI&apos;s Instant Team Formation engine for optimal contributor matching.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Estimated Team Size
          </Label>
          <Select
            value={formData.teamSize}
            onValueChange={(v) => updateField("teamSize", v)}
          >
            <SelectTrigger>
              <Users className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
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
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Work Model
          </Label>
          <Select
            value={formData.workModel}
            onValueChange={(v) => updateField("workModel", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fully-remote">Fully Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="on-site">On-Site</SelectItem>
              <SelectItem value="flexible">Flexible / Async</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roles list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[12px] font-semibold text-brown-800">
            Required Roles *
          </Label>
          <button
            onClick={() => addListItem("roles")}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Role
          </button>
        </div>
        <div className="space-y-2">
          {formData.roles.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brown-50 flex items-center justify-center shrink-0">
                <Users className="w-3 h-3 text-brown-400" />
              </div>
              <Input
                placeholder="e.g., Senior React Developer, DevOps Engineer, UI/UX Designer"
                value={item}
                onChange={(e) => updateListItem("roles", idx, e.target.value)}
                className="h-9 text-[13px]"
              />
              {formData.roles.length > 1 && (
                <button
                  onClick={() => removeListItem("roles", idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-beige-400 hover:text-brown-600 hover:bg-beige-100 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Skill Priorities & Preferences
        </Label>
        <Textarea
          placeholder="e.g., Must have TypeScript expertise, prefer contributors with fintech experience, need at least 2 senior-level resources"
          value={formData.skillPriorities}
          onChange={(e) => updateField("skillPriorities", e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

/* ================================================================
   STEP 6 — Quality Standards
   ================================================================ */
function StepQualityStandards({
  formData,
  updateField,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Define acceptance criteria, SLA targets, and quality gates. These become
        enforceable checkpoints in the generated SOW and feed into APG governance.
      </p>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Acceptance Criteria *
        </Label>
        <Textarea
          placeholder="Describe what constitutes acceptable delivery. e.g., All features pass automated tests, code coverage > 80%, accessibility WCAG 2.1 AA compliant"
          value={formData.acceptanceCriteria}
          onChange={(e) => updateField("acceptanceCriteria", e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            SLA / Uptime Target
          </Label>
          <Select
            value={formData.slaUptime}
            onValueChange={(v) => updateField("slaUptime", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select SLA target" />
            </SelectTrigger>
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
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Testing Requirements
          </Label>
          <Select
            value={formData.testingRequirements}
            onValueChange={(v) => updateField("testingRequirements", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select testing level" />
            </SelectTrigger>
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
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Code Review Policy
        </Label>
        <Select
          value={formData.codeReviewPolicy}
          onValueChange={(v) => updateField("codeReviewPolicy", v)}
        >
          <SelectTrigger>
            <Eye className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
            <SelectValue placeholder="Select code review approach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="peer">Peer Review (1 reviewer)</SelectItem>
            <SelectItem value="senior">Senior Review Required</SelectItem>
            <SelectItem value="two-reviewers">Two Reviewers Required</SelectItem>
            <SelectItem value="mentor-review">Mentor-Guided Review (APG)</SelectItem>
            <SelectItem value="ai-assisted">AI-Assisted + Human Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality tip */}
      <div className="rounded-xl bg-gradient-to-r from-forest-50 to-beige-50 border border-forest-100/60 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-forest-700 leading-relaxed">
            <span className="font-semibold">Quality Gates:</span> These criteria will be
            embedded as automated quality gates in the APG (Autonomous Project Governor),
            ensuring every deliverable meets your standards before acceptance.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 7 — Security & Compliance
   ================================================================ */
function StepSecurityCompliance({
  formData,
  updateField,
  addListItem,
  removeListItem,
  updateListItem,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Specify data sensitivity levels and regulatory requirements. The AI will
        embed compliance clauses and security provisions into the generated SOW.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Data Sensitivity Level *
          </Label>
          <Select
            value={formData.dataSensitivity}
            onValueChange={(v) => updateField("dataSensitivity", v)}
          >
            <SelectTrigger>
              <Lock className="w-3.5 h-3.5 mr-1.5 text-beige-400" />
              <SelectValue placeholder="Select sensitivity level" />
            </SelectTrigger>
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
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Encryption Requirements
          </Label>
          <Select
            value={formData.encryptionRequirements}
            onValueChange={(v) => updateField("encryptionRequirements", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select encryption level" />
            </SelectTrigger>
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

      {/* Regulations list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[12px] font-semibold text-brown-800">
            Regulatory Frameworks
          </Label>
          <button
            onClick={() => addListItem("regulations")}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.regulations.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brown-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3 h-3 text-brown-400" />
              </div>
              <Input
                placeholder="e.g., GDPR, SOC 2 Type II, HIPAA, PCI-DSS, ISO 27001"
                value={item}
                onChange={(e) => updateListItem("regulations", idx, e.target.value)}
                className="h-9 text-[13px]"
              />
              {formData.regulations.length > 1 && (
                <button
                  onClick={() => removeListItem("regulations", idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-beige-400 hover:text-brown-600 hover:bg-beige-100 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Access Control Model
        </Label>
        <Select
          value={formData.accessControl}
          onValueChange={(v) => updateField("accessControl", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select access control approach" />
          </SelectTrigger>
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
function StepRiskParameters({
  formData,
  updateField,
  addListItem,
  removeListItem,
  updateListItem,
}: {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Identify known risks and constraints. The AI will generate mitigation
        strategies and contingency clauses based on your risk profile.
      </p>

      {/* Known Risks list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[12px] font-semibold text-brown-800">
            Known Risks *
          </Label>
          <button
            onClick={() => addListItem("knownRisks")}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Risk
          </button>
        </div>
        <div className="space-y-2">
          {formData.knownRisks.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gold-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3 h-3 text-gold-500" />
              </div>
              <Input
                placeholder="e.g., Third-party API dependency may have rate limits"
                value={item}
                onChange={(e) => updateListItem("knownRisks", idx, e.target.value)}
                className="h-9 text-[13px]"
              />
              {formData.knownRisks.length > 1 && (
                <button
                  onClick={() => removeListItem("knownRisks", idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-beige-400 hover:text-brown-600 hover:bg-beige-100 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
          Project Constraints
        </Label>
        <Textarea
          placeholder="e.g., Must not exceed 6-month timeline, limited to approved vendor list, must integrate with existing legacy system without downtime"
          value={formData.constraints}
          onChange={(e) => updateField("constraints", e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Contingency Budget (%)
          </Label>
          <Select
            value={formData.contingencyBudget}
            onValueChange={(v) => updateField("contingencyBudget", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contingency %" />
            </SelectTrigger>
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
          <Label className="text-[12px] font-semibold text-brown-800 mb-1.5 block">
            Escalation Process
          </Label>
          <Select
            value={formData.escalationProcess}
            onValueChange={(v) => updateField("escalationProcess", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select escalation model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiered">{"Tiered (L1 → L2 → L3)"}</SelectItem>
              <SelectItem value="direct">Direct to Stakeholder</SelectItem>
              <SelectItem value="committee">Steering Committee</SelectItem>
              <SelectItem value="apg-governed">APG-Governed Auto-Escalation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Risk tip */}
      <div className="rounded-xl bg-gradient-to-r from-gold-50 to-beige-50 border border-gold-100/60 p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-gold-700 leading-relaxed">
            <span className="font-semibold">Risk AI:</span> The more risks you identify
            upfront, the better the AI can generate targeted mitigation strategies and
            realistic contingency plans in the SOW.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STEP 9 — Review & Generate
   ================================================================ */
function StepReviewGenerate({
  formData,
  aiConfidence,
  isStepComplete,
}: {
  formData: FormData;
  aiConfidence: number;
  isStepComplete: (step: number) => boolean;
}) {
  const summaryRows = [
    {
      label: "Project",
      value: formData.title || "Not specified",
      filled: formData.title.trim().length > 0,
    },
    {
      label: "Client",
      value: formData.client || "Not specified",
      filled: formData.client.trim().length > 0,
    },
    {
      label: "Industry",
      value: formData.industry
        ? formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)
        : "Not specified",
      filled: formData.industry.length > 0,
    },
    {
      label: "Objectives",
      value: formData.objectives
        ? formData.objectives.slice(0, 80) + (formData.objectives.length > 80 ? "..." : "")
        : "Not specified",
      filled: formData.objectives.trim().length > 0,
    },
    {
      label: "Deliverables",
      value: formData.deliverables.filter((d) => d.trim()).length
        ? `${formData.deliverables.filter((d) => d.trim()).length} defined`
        : "Not specified",
      filled: formData.deliverables.some((d) => d.trim().length > 0),
    },
    {
      label: "Tech Stack",
      value: formData.techStack
        ? formData.techStack.slice(0, 60) + (formData.techStack.length > 60 ? "..." : "")
        : "Not specified",
      filled: formData.techStack.trim().length > 0,
    },
    {
      label: "Timeline",
      value:
        formData.startDate && formData.endDate
          ? `${formData.startDate} to ${formData.endDate}`
          : "Not specified",
      filled: formData.startDate.length > 0 && formData.endDate.length > 0,
    },
    {
      label: "Budget",
      value:
        formData.budgetMin || formData.budgetMax
          ? `${formData.currency} ${formData.budgetMin || "?"} - ${formData.budgetMax || "?"}`
          : "Not specified",
      filled: formData.budgetMin.length > 0 || formData.budgetMax.length > 0,
    },
    {
      label: "Team",
      value: formData.roles.filter((r) => r.trim()).length
        ? `${formData.roles.filter((r) => r.trim()).length} roles, ${formData.teamSize || "auto"} size`
        : "Not specified",
      filled: formData.roles.some((r) => r.trim().length > 0),
    },
    {
      label: "Security",
      value: formData.dataSensitivity
        ? formData.dataSensitivity.charAt(0).toUpperCase() + formData.dataSensitivity.slice(1)
        : "Not specified",
      filled: formData.dataSensitivity.length > 0,
    },
    {
      label: "Risks",
      value: formData.knownRisks.filter((r) => r.trim()).length
        ? `${formData.knownRisks.filter((r) => r.trim()).length} identified`
        : "Not specified",
      filled: formData.knownRisks.some((r) => r.trim().length > 0),
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-beige-600 leading-relaxed">
        Review your inputs below. The AI will use these parameters to generate a
        comprehensive, structured Statement of Work. You can edit the generated
        document after creation.
      </p>

      {/* Confidence banner */}
      <div
        className={cn(
          "rounded-xl p-4 border",
          aiConfidence >= 70
            ? "bg-gradient-to-r from-forest-50 to-teal-50 border-forest-200/60"
            : aiConfidence >= 40
              ? "bg-gradient-to-r from-gold-50 to-beige-50 border-gold-200/60"
              : "bg-gradient-to-r from-brown-50 to-beige-50 border-brown-200/60"
        )}
      >
        <div className="flex items-center gap-4">
          <MetricRing
            value={aiConfidence}
            size={56}
            strokeWidth={5}
            color={aiConfidence >= 70 ? "forest" : aiConfidence >= 40 ? "gold" : "brown"}
          />
          <div>
            <h4
              className={cn(
                "text-[13px] font-bold",
                aiConfidence >= 70
                  ? "text-forest-800"
                  : aiConfidence >= 40
                    ? "text-gold-800"
                    : "text-brown-800"
              )}
            >
              {aiConfidence >= 70
                ? "High Confidence -- Ready for Generation"
                : aiConfidence >= 40
                  ? "Moderate Confidence -- Consider Adding More Details"
                  : "Low Confidence -- More Input Recommended"}
            </h4>
            <p
              className={cn(
                "text-[12px] mt-0.5",
                aiConfidence >= 70
                  ? "text-forest-600"
                  : aiConfidence >= 40
                    ? "text-gold-600"
                    : "text-brown-600"
              )}
            >
              {summaryRows.filter((r) => r.filled).length} of {summaryRows.length}{" "}
              data points provided. More detail yields a higher-quality SOW.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="rounded-xl border border-beige-200/60 overflow-hidden">
        {summaryRows.map((row, idx) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center gap-3 px-5 py-3",
              idx % 2 === 0 ? "bg-white/60" : "bg-beige-50/40",
              idx < summaryRows.length - 1 && "border-b border-beige-100/60"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                row.filled ? "bg-forest-100" : "bg-beige-100"
              )}
            >
              {row.filled ? (
                <CheckCircle2 className="w-3 h-3 text-forest-500" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-beige-300" />
              )}
            </div>
            <span className="text-[12px] font-semibold text-brown-700 w-24 shrink-0">
              {row.label}
            </span>
            <span
              className={cn(
                "text-[12px] truncate",
                row.filled ? "text-brown-800" : "text-beige-400 italic"
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Steps completion grid */}
      <div>
        <h4 className="text-[12px] font-bold text-beige-500 uppercase tracking-wider mb-3">
          Step Completion
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {STEPS.slice(0, -1).map((step, idx) => {
            const complete = isStepComplete(idx);
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                  complete
                    ? "bg-forest-50 border-forest-100 text-forest-700"
                    : "bg-beige-50/60 border-beige-100 text-beige-400"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                    complete ? "bg-forest-500 text-white" : "bg-beige-200 text-beige-400"
                  )}
                >
                  {complete ? (
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="text-[11px] font-semibold truncate">
                  {step.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate CTA */}
      <div className="rounded-xl bg-gradient-to-r from-brown-50 via-beige-50 to-gold-50 border border-brown-200/40 p-6 text-center">
        <Sparkles className="w-8 h-8 text-brown-500 mx-auto mb-3" />
        <h3 className="text-[15px] font-bold text-brown-900 mb-1 font-heading">
          Ready to Generate Your SOW
        </h3>
        <p className="text-[12px] text-beige-600 mb-4 max-w-md mx-auto">
          Our AI will produce a structured, compliance-ready Statement of Work
          based on your {summaryRows.filter((r) => r.filled).length} data points.
          You can review and edit the result before finalizing.
        </p>
        <Link href="/enterprise/sow/generate/review">
          <Button
            variant="gradient-primary"
            size="lg"
            className="gap-2 shadow-lg shadow-brown-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Generate SOW with AI
          </Button>
        </Link>
      </div>
    </div>
  );
}
