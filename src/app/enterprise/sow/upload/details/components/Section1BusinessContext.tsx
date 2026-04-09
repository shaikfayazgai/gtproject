"use client";

import * as React from "react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue, optLabel } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

const CRITICALITY_OPTIONS = [
  { value: "mission_critical", label: "Mission-critical" },
  { value: "business_important", label: "Business-important" },
  { value: "standard", label: "Standard" },
  { value: "low", label: "Low" },
];

export function Section1BusinessContext({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.businessContext);

  return (
    <>
      <SectionHeader number={1} title="Business Context & Vision" />

      <div className="px-6 py-6 space-y-5">

        <Field label="Project Vision" hint="Becomes the SOW opening vision statement.">
          <ReadOnlyValue value={data?.projectVision} multiline />
        </Field>

        <Field label="Business Criticality">
          <ReadOnlyValue value={optLabel(CRITICALITY_OPTIONS, data?.businessCriticality)} />
        </Field>

        <Field label="Definition of Project Success">
          <ReadOnlyValue value={data?.definitionOfSuccess} multiline />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Current State (As-Is)" info="Describe the existing system, or 'Not applicable — greenfield'.">
            <ReadOnlyValue value={data?.currentState} multiline />
          </Field>

          <Field label="Desired Future State (To-Be)">
            <ReadOnlyValue value={data?.desiredFutureState} multiline />
          </Field>
        </div>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} />
    </>
  );
}
