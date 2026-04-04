import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SOW, SOWApprovalStage } from "@/types/enterprise";

/* ── Fresh seed data (2 SOWs, dummy data cleared) ── */
const FRESH_SOWS: SOW[] = [
  {
    id: "sow-a1",
    title: "AI-Driven Supply Chain Optimizer",
    client: "Luminary Logistics",
    status: "approval",
    intakeMode: "ai_generated",
    confidentiality: "confidential",
    dataSensitivity: "confidential",
    version: 1,
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-04-01T14:30:00Z",
    createdBy: "Enterprise Admin",
    fileSize: "2.1 MB",
    pages: 38,
    parsedSections: 10,
    totalSections: 10,
    aiConfidence: 91,
    riskScore: { completeness: 27, confidence: 22, compliance: 23, patternMatch: 18, overall: 24 },
    tags: ["AI", "Logistics", "Supply Chain"],
    estimatedBudget: 450000,
    estimatedDuration: "7 months",
    stakeholders: ["Enterprise Admin", "Operations Lead"],
    approvalStages: [
      { stage: "business", status: "approved", reviewer: "Enterprise Admin", reviewedAt: "2026-03-29T10:00:00Z", comments: "Scope and budget aligned." },
      { stage: "glimmora_commercial", status: "approved", reviewer: "GlimmoraTeam Commercial", reviewedAt: "2026-03-30T15:00:00Z", comments: "Rate cards verified." },
      { stage: "legal", status: "in_review", reviewer: "Sarah Chen (Legal Counsel)" },
      { stage: "security", status: "pending" },
      { stage: "final", status: "pending" },
    ],
  },
  {
    id: "sow-b2",
    title: "Cloud-Native EHR Migration",
    client: "HealthBridge Systems",
    status: "approval",
    intakeMode: "manual_upload",
    confidentiality: "restricted",
    dataSensitivity: "restricted",
    version: 1,
    createdAt: "2026-03-25T11:00:00Z",
    updatedAt: "2026-04-01T16:00:00Z",
    createdBy: "Enterprise Admin",
    fileSize: "3.4 MB",
    pages: 54,
    parsedSections: 14,
    totalSections: 14,
    aiConfidence: 88,
    riskScore: { completeness: 26, confidence: 21, compliance: 24, patternMatch: 17, overall: 28 },
    tags: ["Healthcare", "Cloud", "Migration", "HIPAA"],
    estimatedBudget: 680000,
    estimatedDuration: "9 months",
    stakeholders: ["Enterprise Admin", "CTO", "Sarah Chen (Legal Counsel)"],
    approvalStages: [
      { stage: "business", status: "approved", reviewer: "Enterprise Admin", reviewedAt: "2026-03-26T10:00:00Z", comments: "Business case validated." },
      { stage: "glimmora_commercial", status: "approved", reviewer: "GlimmoraTeam Commercial", reviewedAt: "2026-03-27T14:00:00Z", comments: "Commercial terms confirmed." },
      { stage: "legal", status: "approved", reviewer: "Sarah Chen (Legal Counsel)", reviewedAt: "2026-03-28T16:00:00Z", comments: "HIPAA compliance verified." },
      { stage: "security", status: "in_review", reviewer: "Dr. Alan Reeves (CISO)" },
      { stage: "final", status: "pending" },
    ],
  },
];

interface SowStoreState {
  sows: SOW[];
  addSow: (sow: SOW) => void;
  updateSow: (id: string, patch: Partial<SOW>) => void;
}

export const useSowStore = create<SowStoreState>()(
  persist(
    (set, get) => ({
      sows: FRESH_SOWS,

      addSow: (sow) => {
        const exists = get().sows.some((s) => s.id === sow.id);
        if (exists) {
          set((state) => ({ sows: state.sows.map((s) => (s.id === sow.id ? sow : s)) }));
        } else {
          set((state) => ({ sows: [sow, ...state.sows] }));
        }
      },

      updateSow: (id, patch) =>
        set((state) => ({
          sows: state.sows.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
    }),
    { name: "gt-sow-list", version: 1, migrate: () => ({ sows: FRESH_SOWS }) }
  )
);

export const INITIAL_APPROVAL_STAGES: SOWApprovalStage[] = [
  { stage: "business",            status: "in_review", reviewer: "Enterprise Admin" },
  { stage: "glimmora_commercial", status: "pending" },
  { stage: "legal",               status: "pending" },
  { stage: "security",            status: "pending" },
  { stage: "final",               status: "pending" },
];
