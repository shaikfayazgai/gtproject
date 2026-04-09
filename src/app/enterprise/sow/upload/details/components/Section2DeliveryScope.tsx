"use client";

import * as React from "react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue, ReadOnlyTags, optLabel } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

const UIUX_OPTIONS = [
  { value: "not_in_scope", label: "Not in scope" },
  { value: "in_scope", label: "In scope" },
  { value: "client_provides", label: "Client provides designs" },
];
const DEPLOY_OPTIONS = [
  { value: "not_in_scope", label: "Not in scope (working build handover)" },
  { value: "cloud", label: "Deploy to cloud" },
  { value: "on_premise", label: "Deploy on-premise" },
  { value: "both", label: "Both" },
];
const GOLIVE_OPTIONS = [
  { value: "not_in_scope", label: "Not in scope" },
  { value: "go_live", label: "Go-live included" },
  { value: "go_live_hypercare", label: "Go-live + Hypercare" },
];
const MIGRATION_OPTIONS = [
  { value: "not_in_scope", label: "Not in scope" },
  { value: "in_scope", label: "In scope" },
];

export function Section2DeliveryScope({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.deliveryScope);

  return (
    <>
      <SectionHeader number={2} title="Delivery Scope Boundary" />

      <div className="px-6 py-6 space-y-5">

        <Field label="Development Scope">
          <ReadOnlyTags items={data?.developmentScope ?? []} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="UI/UX Design Scope">
            <ReadOnlyValue value={optLabel(UIUX_OPTIONS, data?.uiuxDesignScope)} />
          </Field>
          <Field label="Deployment Scope">
            <ReadOnlyValue value={optLabel(DEPLOY_OPTIONS, data?.deploymentScope)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Go-Live & Hypercare">
            <ReadOnlyValue value={optLabel(GOLIVE_OPTIONS, data?.goLiveScope)} />
          </Field>
          <Field label="Data Migration Scope">
            <ReadOnlyValue value={optLabel(MIGRATION_OPTIONS, data?.dataMigrationScope)} />
          </Field>
        </div>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} />
    </>
  );
}
