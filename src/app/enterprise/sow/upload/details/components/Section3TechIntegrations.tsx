"use client";

import * as React from "react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

export function Section3TechIntegrations({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.techIntegrations);

  return (
    <>
      <SectionHeader number={3} title="Technical Architecture & Integrations" />

      <div className="px-6 py-6 space-y-5">

        <Field label="Technology Stack">
          <ReadOnlyValue value={data?.technologyStack} multiline />
        </Field>

        <Field label="Scalability & Performance Requirements">
          <ReadOnlyValue value={data?.scalabilityRequirements} multiline />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="User Management Scope">
            <ReadOnlyValue value={data?.userManagementScope} />
          </Field>
          <Field label="SSO Required">
            <ReadOnlyValue value={data?.ssoRequired ? "Yes — SSO is required" : "No"} />
          </Field>
        </div>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} />
    </>
  );
}
