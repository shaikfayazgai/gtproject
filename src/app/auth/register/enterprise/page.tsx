"use client";

import Link from "next/link";
import { Briefcase, Sparkles } from "lucide-react";

import { useEnterpriseRegistration } from "./hooks/useEnterpriseRegistration";
import { EnterpriseStepProgress }    from "./components/EnterpriseStepProgress";
import { Step1Organization }         from "./components/Step1Organization";
import { Step2AdminContact }         from "./components/Step2AdminContact";
import { Step3Security }             from "./components/Step3Security";
import { Step4Agreements }           from "./components/Step4Agreements";

/* ══════════════════════════════════════════════════════════════════
   Enterprise Register Page — thin orchestrator
   State & handlers live in useEnterpriseRegistration hook
══════════════════════════════════════════════════════════════════ */

export default function EnterpriseRegisterPage() {
  const reg = useEnterpriseRegistration();

  return (
    <div className="w-full max-w-xl py-8">

      {/* Branding header */}
      <div className="text-center mb-7">
        <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-semibold text-brown-950 group-hover:text-brown-700 transition-colors">
            GlimmoraTeam™
          </span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brown-100 border border-brown-200 mb-3">
          <Briefcase className="w-3.5 h-3.5 text-brown-600" />
          <span className="text-xs font-semibold text-brown-700">Enterprise Account</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-brown-950">Register Your Organisation</h1>
        <p className="text-sm text-beige-500 mt-1">Hire globally, manage intelligently — 4 quick steps to get started</p>
      </div>

      {/* Step progress */}
      <div className="mb-5">
        <EnterpriseStepProgress step={reg.step} />
      </div>

      {/* Step 1 — Organisation Profile */}
      {reg.step === 1 && (
        <Step1Organization
          orgName={reg.orgName}             setOrgName={reg.setOrgName}
          orgType={reg.orgType}             setOrgType={reg.setOrgType}
          industry={reg.industry}           setIndustry={reg.setIndustry}
          companySize={reg.companySize}     setCompanySize={reg.setCompanySize}
          foundedYear={reg.foundedYear}     setFoundedYear={reg.setFoundedYear}
          website={reg.website}             setWebsite={reg.setWebsite}
          tagline={reg.tagline}             setTagline={reg.setTagline}
          hqCountry={reg.hqCountry}         setHqCountry={reg.setHqCountry}
          hqCity={reg.hqCity}               setHqCity={reg.setHqCity}
          error={reg.error}
          onContinue={reg.goToStep2}
        />
      )}

      {/* Step 2 — Primary Administrator */}
      {reg.step === 2 && (
        <Step2AdminContact
          adminFirstName={reg.adminFirstName} setAdminFirstName={reg.setAdminFirstName}
          adminLastName={reg.adminLastName}   setAdminLastName={reg.setAdminLastName}
          adminTitle={reg.adminTitle}         setAdminTitle={reg.setAdminTitle}
          adminEmail={reg.adminEmail}         setAdminEmail={reg.setAdminEmail}
          adminDept={reg.adminDept}           setAdminDept={reg.setAdminDept}
          adminLinkedin={reg.adminLinkedin}   setAdminLinkedin={reg.setAdminLinkedin}
          phoneCountry={reg.phoneCountry}     setPhoneCountry={reg.setPhoneCountry}
          phone={reg.phone}                   setPhone={reg.setPhone}
          error={reg.error}
          onContinue={reg.goToStep3}
          onBack={() => { reg.setStep(1); reg.setError(""); }}
        />
      )}

      {/* Step 3 — Security */}
      {reg.step === 3 && (
        <Step3Security
          password={reg.password}           setPassword={reg.setPassword}
          confirm={reg.confirm}             setConfirm={reg.setConfirm}
          mfaMethod={reg.mfaMethod}         setMfaMethod={reg.setMfaMethod}
          passwordStrength={reg.passwordStrength}
          error={reg.error}
          onContinue={reg.goToStep4}
          onBack={() => { reg.setStep(2); reg.setError(""); }}
        />
      )}

      {/* Step 4 — Agreements */}
      {reg.step === 4 && (
        <Step4Agreements
          acceptTos={reg.acceptTos}           setAcceptTos={reg.setAcceptTos}
          acceptPp={reg.acceptPp}             setAcceptPp={reg.setAcceptPp}
          acceptEsa={reg.acceptEsa}           setAcceptEsa={reg.setAcceptEsa}
          acceptAhp={reg.acceptAhp}           setAcceptAhp={reg.setAcceptAhp}
          marketingOptIn={reg.marketingOptIn} setMarketingOptIn={reg.setMarketingOptIn}
          isLoading={reg.isLoading}
          error={reg.error}
          onSubmit={reg.handleFinalSubmit}
          onBack={() => { reg.setStep(3); reg.setError(""); }}
        />
      )}

      {/* Footer */}
      <p className="text-center text-sm text-beige-600 mt-5">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">Sign in</Link>
        {" · "}
        <Link href="/auth/register" className="text-teal-600 hover:text-teal-700 font-medium">Not an enterprise?</Link>
      </p>
    </div>
  );
}
