"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES_DATA } from "../data";
import { getPasswordStrength, getAgeFromDob } from "../helpers";
import type { RegistrationRole, ContributorType } from "../types";

export function useRegistration() {
  const router = useRouter();

  /* ── Meta ── */
  const [registrationRole, setRegistrationRole] = useState<RegistrationRole>("");
  const [step, setStep]                         = useState(1);
  const [error, setError]                       = useState("");
  const [isLoading, setIsLoading]               = useState(false);
  const [previewOpen, setPreviewOpen]           = useState(false);

  /* ── Step 1: Identity ── */
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showCon,     setShowCon]     = useState(false);
  const [contribType, setContribType] = useState<ContributorType>("");
  const [dob,         setDob]         = useState("");
  const [country,     setCountry]     = useState("");

  /* ── Step 2: Verification ── */
  const [phoneCountry,      setPhoneCountry]      = useState("India");
  const [phone,             setPhone]             = useState("");
  const [otpSent,           setOtpSent]           = useState(false);
  const [otp,               setOtp]               = useState("");
  const [cooldown,          setCooldown]          = useState(0);
  const [phoneVerified,     setPhoneVerified]     = useState(false);
  const [phoneOtpLoading,   setPhoneOtpLoading]  = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [emailOtpSent,      setEmailOtpSent]      = useState(false);
  const [emailOtp,          setEmailOtp]          = useState("");
  const [emailCooldown,     setEmailCooldown]     = useState(0);
  const [emailVerified,     setEmailVerified]     = useState(false);
  const [emailOtpLoading,   setEmailOtpLoading]  = useState(false);

  /* ── Step 3: Profile ── */
  const [timezone,            setTimezone]            = useState("");
  const [departmentCategory,  setDepartmentCategory]  = useState("");
  const [departmentOther,     setDepartmentOther]     = useState("");
  const [availability,        setAvailability]        = useState("");
  const [degree,              setDegree]              = useState("");
  const [branch,              setBranch]              = useState("");
  const [linkedin,            setLinkedin]            = useState("");
  const [mentorAck,           setMentorAck]           = useState(false);

  // Primary skills (autocomplete from curated list)
  const [primarySkills,    setPrimarySkills]    = useState<string[]>([]);
  const [skillInput,       setSkillInput]       = useState("");

  // Secondary skills (autocomplete from curated list, excludes primary picks)
  const [secondarySkills,      setSecondarySkills]      = useState<string[]>([]);
  const [secondarySkillInput,  setSecondarySkillInput]  = useState("");

  // Other / niche skills (free-form, press Enter to add)
  const [otherSkills,      setOtherSkills]      = useState<string[]>([]);
  const [otherSkillInput,  setOtherSkillInput]  = useState("");

  // Type-specific fields
  const [workStart,        setWorkStart]        = useState("");
  const [workEnd,          setWorkEnd]          = useState("");
  const [careerStage,      setCareerStage]      = useState("");
  const [yearsExperience,  setYearsExperience]  = useState("");

  /* ── Step 4: Consent ── */
  const [resumeFile,      setResumeFile]      = useState<File | null>(null);
  const [resumeDrag,      setResumeDrag]      = useState(false);
  const [acceptTos,       setAcceptTos]       = useState(false);
  const [acceptCoc,       setAcceptCoc]       = useState(false);
  const [acceptDpa,       setAcceptDpa]       = useState(false);
  const [acceptFee,       setAcceptFee]       = useState(false);
  const [acceptAhp,       setAcceptAhp]       = useState(false);
  const [marketingOptIn,  setMarketingOptIn]  = useState(false);

  /* ── Effects ── */

  // Mirror registration email to verification email on first entry
  useEffect(() => {
    if (email && !verificationEmail) setVerificationEmail(email);
  }, [email, verificationEmail]);

  // Auto-sync phone country when user lands on step 2
  useEffect(() => {
    if (step === 2 && country) {
      const match = COUNTRIES_DATA.find(c => c.name === country);
      if (match) {
        setPhoneCountry(match.name);
        setPhone(prev => (prev.startsWith(match.code) ? prev : match.code + " "));
      }
    }
  }, [step, country]);

  /* ── Cooldown helpers ── */

  function startCooldown() {
    setCooldown(30);
    const iv = setInterval(() => {
      setCooldown(p => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; });
    }, 1000);
  }

  function startEmailCooldown() {
    setEmailCooldown(30);
    const iv = setInterval(() => {
      setEmailCooldown(p => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; });
    }, 1000);
  }

  /* ── Skill helpers ── */

  const addPrimarySkill    = (s: string) => { if (primarySkills.length < 20)   setPrimarySkills(p => [...p, s]);   setSkillInput(""); };
  const removePrimarySkill = (s: string) => setPrimarySkills(p => p.filter(x => x !== s));

  const addSecondarySkill    = (s: string) => { if (secondarySkills.length < 20) setSecondarySkills(p => [...p, s]); setSecondarySkillInput(""); };
  const removeSecondarySkill = (s: string) => setSecondarySkills(p => p.filter(x => x !== s));

  const addOtherSkill    = (s: string) => { if (otherSkills.length < 20) setOtherSkills(p => [...p, s]); setOtherSkillInput(""); };
  const removeOtherSkill = (s: string) => setOtherSkills(p => p.filter(x => x !== s));

  /* ── OTP actions ── */

  async function sendOTP() {
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number"); return;
    }
    setError("");
    setPhoneOtpLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPhoneOtpLoading(false);
    setOtpSent(true);
    startCooldown();
  }

  async function verifyOTP() {
    if (otp.length !== 6) { setError("Please enter the 6-digit code"); return; }
    setError("");
    setPhoneOtpLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setPhoneOtpLoading(false);
    setPhoneVerified(true);
  }

  async function sendEmailOTP() {
    if (!verificationEmail) { setError("Please enter a valid email address"); return; }
    setError("");
    setEmailOtpLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setEmailOtpLoading(false);
    setEmailOtpSent(true);
    startEmailCooldown();
  }

  async function verifyEmailOTP() {
    if (emailOtp.length !== 6) { setError("Please enter the 6-digit email code"); return; }
    setError("");
    setEmailOtpLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setEmailOtpLoading(false);
    setEmailVerified(true);
  }

  /* ── Navigation ── */

  function goToStep2() {
    if (!firstName.trim())    { setError("Please enter your first name"); return; }
    if (!lastName.trim())     { setError("Please enter your last name"); return; }
    if (!email)               { setError("Please enter a valid email address"); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters with a number and mixed case"); return; }
    if (password !== confirm)  { setError("Passwords do not match — please re-enter"); return; }
    if (!contribType)          { setError("Please select your contributor type"); return; }
    if (!dob)                  { setError("Please enter your date of birth"); return; }
    if (getAgeFromDob(dob) < 18) { setError("You must be 18 or older to register"); return; }
    if (!country)              { setError("Please select your country of residence"); return; }
    setError(""); setStep(2);
  }

  function goToStep3() {
    if (!phoneVerified || !emailVerified) {
      setError("Please verify both your phone number and email address to continue");
      return;
    }
    setError(""); setStep(3);
  }

  function goToStep4() {
    if (!timezone)           { setError("Please select your working time zone"); return; }
    if (!departmentCategory) { setError("Please select your department category"); return; }
    if (departmentCategory === "other" && !departmentOther.trim()) {
      setError("Please specify your department name"); return;
    }
    if (primarySkills.length < 1) { setError("Please add at least one primary skill"); return; }
    if (!availability)         { setError("Please enter your weekly availability (hours)"); return; }
    if (!mentorAck)            { setError("Please acknowledge the Reviewer / Mentor requirement to proceed"); return; }
    setError(""); setStep(4);
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptTos) { setError("You must accept the Terms of Use to proceed"); return; }
    if (!acceptCoc) { setError("You must accept the Code of Conduct to proceed"); return; }
    if (!acceptDpa) { setError("You must accept the Data Processing Agreement to proceed"); return; }
    if (!acceptAhp) { setError("You must accept the Anti-Harassment Policy to proceed"); return; }
    if (!acceptFee) { setError("You must acknowledge the platform service fee to proceed"); return; }
    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    router.push("/contributor/dashboard");
  }

  /* ── Computed ── */
  const passwordStrength = getPasswordStrength(password);

  return {
    /* meta */
    registrationRole, setRegistrationRole,
    step, setStep,
    error, setError,
    isLoading,
    previewOpen, setPreviewOpen,

    /* step 1 */
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    showPw, setShowPw,
    showCon, setShowCon,
    contribType, setContribType,
    dob, setDob,
    country, setCountry,
    passwordStrength,

    /* step 2 */
    phoneCountry, setPhoneCountry,
    phone, setPhone,
    otpSent,
    otp, setOtp,
    cooldown,
    phoneVerified,
    phoneOtpLoading,
    verificationEmail, setVerificationEmail,
    emailOtpSent,
    emailOtp, setEmailOtp,
    emailCooldown,
    emailVerified,
    emailOtpLoading,
    sendOTP, verifyOTP, sendEmailOTP, verifyEmailOTP,

    /* step 3 */
    timezone, setTimezone,
    departmentCategory, setDepartmentCategory,
    departmentOther, setDepartmentOther,
    availability, setAvailability,
    degree, setDegree,
    branch, setBranch,
    linkedin, setLinkedin,
    mentorAck, setMentorAck,
    primarySkills, skillInput, setSkillInput, addPrimarySkill, removePrimarySkill,
    secondarySkills, secondarySkillInput, setSecondarySkillInput, addSecondarySkill, removeSecondarySkill,
    otherSkills, otherSkillInput, setOtherSkillInput, addOtherSkill, removeOtherSkill,
    workStart, setWorkStart,
    workEnd, setWorkEnd,
    careerStage, setCareerStage,
    yearsExperience, setYearsExperience,

    /* step 4 */
    resumeFile, setResumeFile,
    resumeDrag, setResumeDrag,
    acceptTos, setAcceptTos,
    acceptCoc, setAcceptCoc,
    acceptDpa, setAcceptDpa,
    acceptFee, setAcceptFee,
    acceptAhp, setAcceptAhp,
    marketingOptIn, setMarketingOptIn,

    /* navigation */
    goToStep2, goToStep3, goToStep4, handleFinalSubmit,
  };
}

export type RegistrationState = ReturnType<typeof useRegistration>;
