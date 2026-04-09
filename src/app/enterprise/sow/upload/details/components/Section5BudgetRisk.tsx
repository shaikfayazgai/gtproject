"use client";

import * as React from "react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue, optLabel } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

const PRICING_OPTIONS = [
  { value: "fixed_price", label: "Fixed Price" },
  { value: "time_and_materials", label: "Time & Materials" },
  { value: "outcome_based", label: "Outcome-Based" },
  { value: "hybrid", label: "Hybrid" },
];
const CONTINGENCY_OPTIONS = [
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
  { value: "15", label: "15%" },
  { value: "20", label: "20%" },
];

export function Section5BudgetRisk({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.budgetRisk);

  return (
    <>
      <SectionHeader number={5} title="Budget & Risk" />

      <div className="px-6 py-6 space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Budget Minimum">
            <ReadOnlyValue value={data?.budgetMinimum ? `${data?.currency ?? "USD"} ${data.budgetMinimum.toLocaleString()}` : undefined} />
          </Field>
          <Field label="Budget Maximum">
            <ReadOnlyValue value={data?.budgetMaximum ? `${data?.currency ?? "USD"} ${data.budgetMaximum.toLocaleString()}` : undefined} />
          </Field>
          <Field label="Currency">
            <ReadOnlyValue value={data?.currency} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Pricing Model">
            <ReadOnlyValue value={optLabel(PRICING_OPTIONS, data?.pricingModel)} />
          </Field>
          <Field label="Contingency Budget">
            <ReadOnlyValue value={optLabel(CONTINGENCY_OPTIONS, data?.contingencyPercent)} />
          </Field>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-3.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            Platform Payment Schedule
          </p>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            35% on SOW onboarding (M1) &nbsp;·&nbsp; 35% on development completion (M2) &nbsp;·&nbsp; 30% on UAT sign-off (M3)
          </p>
        </div>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} />
    </>
  );
}
