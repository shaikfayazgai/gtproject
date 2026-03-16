"use client";

import { useState } from "react";
import {
  AlertCircle, ArrowRight, ArrowLeft,
  Eye, EyeOff, Lock, Smartphone, MessageSquare, Mail,
  ShieldCheck, CheckCircle,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import type { MfaMethod } from "../hooks/useEnterpriseRegistration";
import type { PasswordStrength } from "../../types";

/* ── MFA option card ── */
const MFA_OPTIONS: {
  value: MfaMethod;
  label: string;
  sub: string;
  badge?: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  {
    value: "totp",
    label: "Authenticator App",
    sub: "Google Authenticator, Authy, Microsoft Authenticator — highest security",
    badge: "Recommended",
    Icon: Smartphone,
  },
  {
    value: "sms",
    label: "SMS One-Time Code",
    sub: "Receive a 6-digit code via text message on each login",
    Icon: MessageSquare,
  },
  {
    value: "email",
    label: "Email One-Time Code",
    sub: "Receive a 6-digit code via email — works without a phone",
    Icon: Mail,
  },
];

interface Props {
  password: string;          setPassword: (v: string) => void;
  confirm: string;           setConfirm: (v: string) => void;
  mfaMethod: MfaMethod;      setMfaMethod: (v: MfaMethod) => void;
  passwordStrength: PasswordStrength;
  error: string;
  onContinue: () => void;
  onBack: () => void;
}

export function Step3Security({
  password, setPassword,
  confirm, setConfirm,
  mfaMethod, setMfaMethod,
  passwordStrength,
  error,
  onContinue, onBack,
}: Props) {
  const [showPw,  setShowPw]  = useState(false);
  const [showCon, setShowCon] = useState(false);

  const pwMatch = confirm.length > 0 && password === confirm;
  const pwMismatch = confirm.length > 0 && password !== confirm;

  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 3 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Account Security</p>
          <p className="text-xs text-beige-500 mt-0.5">Enterprise accounts require a strong password and mandatory two-factor authentication</p>
        </div>

        <div className="space-y-6">

          {/* ══ Password ══ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
                <Lock className="w-3 h-3 text-brown-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Password</p>
            </div>

            <div className="space-y-4">
              {/* Password input */}
              <div className="space-y-2">
                <Label htmlFor="pw">
                  Password <span className="text-red-400">*</span>{" "}
                  <span className="text-beige-400 text-xs">(min 12 characters)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={showPw ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength.score ? passwordStrength.color : "bg-beige-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${
                        passwordStrength.score <= 1 ? "text-red-500"
                        : passwordStrength.score <= 3 ? "text-gold-600"
                        : "text-teal-600"
                      }`}>
                        {passwordStrength.label}
                      </p>
                      <p className="text-[10px] text-beige-400">
                        {passwordStrength.score < 5 ? "Add symbols & length for a stronger password" : "Excellent password strength"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="con">Confirm Password <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Input
                    id="con"
                    type={showCon ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`pr-10 ${pwMismatch ? "border-red-300 focus:border-red-400" : pwMatch ? "border-teal-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCon(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                  >
                    {showCon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwMatch    && <p className="text-xs text-teal-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>}
                {pwMismatch && <p className="text-xs text-red-500">Passwords do not match</p>}
              </div>
            </div>
          </div>

          {/* ══ Two-Factor Authentication ══ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3 h-3 text-brown-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Two-Factor Authentication</p>
              <span className="text-[10px] text-red-400 font-medium">Mandatory</span>
            </div>

            <p className="text-xs text-beige-500 mb-3 leading-relaxed">
              Enterprise accounts require MFA on every login. Choose your preferred method — you will complete setup on the next screen.
            </p>

            <div className="space-y-2">
              {MFA_OPTIONS.map(({ value, label, sub, badge, Icon }) => (
                <label
                  key={value}
                  htmlFor={`mfa-${value}`}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    mfaMethod === value
                      ? "border-brown-600 bg-brown-50"
                      : "border-beige-200 hover:border-brown-300 bg-white"
                  }`}
                >
                  <input
                    id={`mfa-${value}`}
                    type="radio"
                    name="mfaMethod"
                    value={value}
                    checked={mfaMethod === value}
                    onChange={() => setMfaMethod(value)}
                    className="sr-only"
                  />
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    mfaMethod === value ? "bg-brown-600 text-white" : "bg-beige-100 text-beige-400"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${mfaMethod === value ? "text-brown-900" : "text-brown-700"}`}>{label}</p>
                      {badge && (
                        <span className="px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-700 text-[10px] font-semibold">{badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-beige-500 mt-0.5 leading-relaxed">{sub}</p>
                  </div>
                  {mfaMethod === value && (
                    <CheckCircle className="w-4 h-4 text-brown-600 shrink-0 mt-1" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <Button type="button" variant="primary" size="lg" className="w-full" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-sm text-beige-600 hover:text-beige-800 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
