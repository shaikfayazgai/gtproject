"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue, optLabel } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

const TEAM_SIZE_OPTIONS = [
  { value: "1-3", label: "1–3" },
  { value: "4-8", label: "4–8" },
  { value: "9-15", label: "9–15" },
  { value: "16-25", label: "16–25" },
  { value: "25+", label: "25+" },
];
const WORK_MODEL_OPTIONS = [
  { value: "remote", label: "Fully remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "flexible", label: "Flexible" },
];

export function Section4TimelineTeam({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.timelineTeam);

  return (
    <>
      <SectionHeader number={4} title="Timeline, Team & Testing" />

      <div className="px-6 py-6 space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Start Date">
            <ReadOnlyValue value={data?.startDate} />
          </Field>
          <Field label="Target End Date">
            <ReadOnlyValue value={data?.targetEndDate} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Estimated Team Size">
            <ReadOnlyValue value={optLabel(TEAM_SIZE_OPTIONS, data?.estimatedTeamSize)} />
          </Field>
          <Field label="Work Model">
            <ReadOnlyValue value={optLabel(WORK_MODEL_OPTIONS, data?.workModel)} />
          </Field>
        </div>

        <div className="rounded-2xl border border-gold-200 bg-gold-50/40 px-5 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-gold-600 shrink-0" />
            <span className="text-[12px] font-semibold text-gold-800">UAT Sign-off Authority</span>
          </div>
          <p className="text-[11px] text-gold-700 leading-relaxed">
            This person&apos;s formal sign-off triggers the <span className="font-semibold">M3 payment milestone</span>.
          </p>
          <Field label="Full Name & Job Title">
            <ReadOnlyValue value={data?.uatSignOffAuthority} />
          </Field>
          <div className="flex items-center gap-2 pt-0.5">
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${data?.uatSignOffConfirmed ? "bg-gold-500 border-gold-500" : "border-gold-300 bg-white"}`}>
              {data?.uatSignOffConfirmed && <span className="text-[9px] text-white font-bold">✓</span>}
            </div>
            <span className="text-[12px] font-medium text-gold-800">
              UAT sign-off authority confirmed
            </span>
          </div>
        </div>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} />
    </>
  );
}
