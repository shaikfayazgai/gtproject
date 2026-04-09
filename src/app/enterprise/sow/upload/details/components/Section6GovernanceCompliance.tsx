"use client";

import * as React from "react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue, ReadOnlyTags, optLabel } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

const SENSITIVITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "internal", label: "Internal" },
  { value: "confidential", label: "Confidential" },
  { value: "restricted", label: "Restricted" },
];
const PERSONAL_DATA_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const RESIDENCY_OPTIONS = [
  { value: "india_only", label: "India only" },
  { value: "eu_only", label: "EU only" },
  { value: "us_only", label: "US only" },
  { value: "no_restriction", label: "No restriction" },
  { value: "custom", label: "Custom" },
];

export function Section6GovernanceCompliance({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.governance);

  return (
    <>
      <SectionHeader number={6} title="Governance & Compliance" />

      <div className="px-6 py-6 space-y-5">

        <div className="rounded-2xl border border-brown-200 bg-brown-50/40 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${data?.nonDiscriminationConfirmed ? "bg-brown-500 border-brown-500" : "border-brown-300 bg-white"}`}>
              {data?.nonDiscriminationConfirmed && <span className="text-[9px] text-white font-bold">✓</span>}
            </div>
            <div>
              <span className="block text-[12px] font-semibold text-brown-800 mb-1">
                Non-Discrimination Confirmation
              </span>
              <p className="text-[11px] text-brown-700 leading-relaxed">
                This project will not discriminate against contributors based on gender, race, religion, disability, or any other protected characteristic.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Data Sensitivity Level">
            <ReadOnlyValue value={optLabel(SENSITIVITY_OPTIONS, data?.dataSensitivityLevel)} />
          </Field>
          <Field label="Personal Data Involved">
            <ReadOnlyValue value={optLabel(PERSONAL_DATA_OPTIONS, data?.personalDataInvolved)} />
          </Field>
        </div>

        <Field label="Data Residency Requirement">
          <ReadOnlyValue value={optLabel(RESIDENCY_OPTIONS, data?.dataResidency)} />
        </Field>

        <Field label="Regulatory Frameworks">
          <ReadOnlyTags items={data?.regulatoryFrameworks ?? []} />
        </Field>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} />
    </>
  );
}
