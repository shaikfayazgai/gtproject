"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES_DATA } from "../../data";
import { getPasswordStrength } from "../../helpers";

export type OrgType =
  | ""
  | "startup"
  | "sme"
  | "large-enterprise"
  | "mnc"
  | "ngo"
  | "government"
  | "educational"
  | "agency";

export type MfaMethod = "totp" | "sms" | "email";

export function useEnterpriseRegistration() {
  const router = useRouter();

  /* ── Meta ── */
  const [step,      setStep]      = useState(1);
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ── Step 1: Organisation Profile ── */
  const [orgName,     setOrgName]     = useState("");
  const [orgType,     setOrgType]     = useState<OrgType>("");
  const [industry,    setIndustry]    = useState("");
  const [companySize, setCompanySize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [website,     setWebsite]     = useState("");
  const [tagline,     setTagline]     = useState("");
  const [hqCountry,   setHqCountry]   = useState("");
  const [hqCity,      setHqCity]      = useState("");

  /* ── Step 2: Primary Administrator ── */
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName,  setAdminLastName]  = useState("");
  const [adminTitle,     setAdminTitle]     = useState("");
  const [adminEmail,     setAdminEmail]     = useState("");
  const [adminDept,      setAdminDept]      = useState("");
  const [adminLinkedin,  setAdminLinkedin]  = useState("");
  const [phoneCountry,   setPhoneCountry]   = useState("India");
  const [phone,          setPhone]          = useState("");

  /* ── Step 3: Security ── */
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>("totp");

  /* ── Step 4: Agreements ── */
  const [acceptTos,      setAcceptTos]      = useState(false);
  const [acceptPp,       setAcceptPp]       = useState(false);
  const [acceptEsa,      setAcceptEsa]      = useState(false);
  const [acceptAhp,      setAcceptAhp]      = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  /* ── Effects ── */

  // Auto-sync phone dial code when HQ country is selected
  useEffect(() => {
    if (!hqCountry) return;
    const match = COUNTRIES_DATA.find(c => c.name === hqCountry);
    if (match) {
      setPhoneCountry(match.name);
      setPhone(prev => (prev.startsWith(match.code) ? prev : match.code + " "));
    }
  }, [hqCountry]);

  /* ── Navigation ── */

  function goToStep2() {
    if (!orgName.trim())   { setError("Please enter your organisation name"); return; }
    if (!orgType)          { setError("Please select your organisation type"); return; }
    if (!industry)         { setError("Please select your industry / sector"); return; }
    if (!companySize)      { setError("Please select your company size"); return; }
    if (!hqCountry)        { setError("Please select your headquarters country"); return; }
    if (foundedYear) {
      const yr = parseInt(foundedYear, 10);
      if (isNaN(yr) || yr < 1800 || yr > new Date().getFullYear()) {
        setError("Please enter a valid founding year (e.g. 2010)"); return;
      }
    }
    setError(""); setStep(2);
  }

  function goToStep3() {
    if (!adminFirstName.trim()) { setError("Please enter the administrator's first name"); return; }
    if (!adminLastName.trim())  { setError("Please enter the administrator's last name"); return; }
    if (!adminTitle.trim())     { setError("Please enter the administrator's job title"); return; }
    if (!adminEmail.trim() || !adminEmail.includes("@")) {
      setError("Please enter a valid business email address"); return;
    }
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number"); return;
    }
    setError(""); setStep(3);
  }

  function goToStep4() {
    if (password.length < 12) { setError("Password must be at least 12 characters"); return; }
    if (password !== confirm)  { setError("Passwords do not match — please re-enter"); return; }
    setError(""); setStep(4);
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptTos) { setError("You must accept the Terms of Use to proceed"); return; }
    if (!acceptPp)  { setError("You must accept the Privacy Policy & DPA to proceed"); return; }
    if (!acceptEsa) { setError("You must accept the Enterprise Service Agreement to proceed"); return; }
    if (!acceptAhp) { setError("You must accept the Anti-Harassment Policy to proceed"); return; }
    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    router.push("/auth/mfa-setup?redirect=/enterprise/dashboard");
  }

  /* ── Computed ── */
  const passwordStrength = getPasswordStrength(password);

  return {
    step, setStep, error, setError, isLoading,

    /* step 1 */
    orgName, setOrgName,
    orgType, setOrgType,
    industry, setIndustry,
    companySize, setCompanySize,
    foundedYear, setFoundedYear,
    website, setWebsite,
    tagline, setTagline,
    hqCountry, setHqCountry,
    hqCity, setHqCity,

    /* step 2 */
    adminFirstName, setAdminFirstName,
    adminLastName, setAdminLastName,
    adminTitle, setAdminTitle,
    adminEmail, setAdminEmail,
    adminDept, setAdminDept,
    adminLinkedin, setAdminLinkedin,
    phoneCountry, setPhoneCountry,
    phone, setPhone,

    /* step 3 */
    password, setPassword,
    confirm, setConfirm,
    mfaMethod, setMfaMethod,
    passwordStrength,

    /* step 4 */
    acceptTos, setAcceptTos,
    acceptPp, setAcceptPp,
    acceptEsa, setAcceptEsa,
    acceptAhp, setAcceptAhp,
    marketingOptIn, setMarketingOptIn,

    /* navigation */
    goToStep2, goToStep3, goToStep4, handleFinalSubmit,
  };
}

export type EnterpriseRegistrationState = ReturnType<typeof useEnterpriseRegistration>;
