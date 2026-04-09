"use client";

import * as React from "react";
import { Scale, Handshake, ShieldCheck } from "lucide-react";
import { useSOWUploadStore } from "@/lib/stores/sow-upload-store";
import { SectionHeader, SectionFooter, Field, ReadOnlyValue, optLabel } from "./_shared";

interface Props { onComplete: () => void; onBack?: () => void }

const IP_OPTIONS = [
  { value: "client_owns_all",            label: "Client Owns All IP" },
  { value: "glimmora_retains_framework", label: "GlimmoraTeam Retains Framework" },
  { value: "joint",                      label: "Joint Ownership" },
  { value: "custom",                     label: "Custom Arrangement" },
];
const SOURCE_CODE_OPTIONS = [
  { value: "glimmora_hosts_transfer",  label: "GlimmoraTeam Hosts → Transfers on M3" },
  { value: "client_provides_day_one", label: "Client Provides Repository" },
];
const THIRD_PARTY_OPTIONS = [
  { value: "client_pays",      label: "Client Pays Directly" },
  { value: "glimmora_absorbs", label: "Absorbed in Quote" },
];
const CHANGE_REQUEST_OPTIONS = [
  { value: "formal_cr",          label: "Formal Change Request" },
  { value: "threshold_cr",       label: "Threshold-Based" },
  { value: "time_and_materials", label: "Time & Materials" },
];

function SubSection({ icon: Icon, title, children }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
        <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      </div>
      <div className="px-4 py-4 space-y-4 bg-white">
        {children}
      </div>
    </div>
  );
}

export function Section7CommercialLegal({ onComplete, onBack }: Props) {
  const data = useSOWUploadStore((s) => s.commercialDetails.commercialLegal);
  const auth = useSOWUploadStore((s) => s.approvalAuthorities);

  return (
    <>
      <SectionHeader number={7} title="Commercial & Legal" />

      <div className="px-6 py-6 space-y-4">

        <SubSection icon={Scale} title="Intellectual Property">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="IP Ownership">
              <ReadOnlyValue value={optLabel(IP_OPTIONS, data?.ipOwnership)} />
            </Field>
            <Field label="Source Code Repository">
              <ReadOnlyValue value={optLabel(SOURCE_CODE_OPTIONS, data?.sourceCodeOwnership)} />
            </Field>
          </div>
        </SubSection>

        <SubSection icon={Handshake} title="Commercial Terms">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Third-Party Licensing Costs">
              <ReadOnlyValue value={optLabel(THIRD_PARTY_OPTIONS, data?.thirdPartyCosts)} />
            </Field>
            <Field label="Change Request Process">
              <ReadOnlyValue value={optLabel(CHANGE_REQUEST_OPTIONS, data?.changeRequestProcess)} />
            </Field>
          </div>
        </SubSection>

        <SubSection icon={ShieldCheck} title="Approval Authorities">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="SOW Submitter">
              <ReadOnlyValue value={auth?.sowSubmitter} />
            </Field>
            <Field label="Business Owner Approver (Stage 1)">
              <ReadOnlyValue value={auth?.businessOwnerApprover} />
            </Field>
          </div>
        </SubSection>

      </div>

      <SectionFooter onBack={onBack} onComplete={onComplete} completeLabel="Generate Final SOW" variant="generate" />
    </>
  );
}
