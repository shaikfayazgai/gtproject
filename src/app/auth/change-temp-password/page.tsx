"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { KeyRound, Sparkles } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

function ChangeTempPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const rawCb = searchParams.get("callbackUrl");
  const callbackUrl = (() => {
    if (!rawCb) return "/enterprise/reviewer";
    try {
      const u = new URL(rawCb, window.location.origin);
      if (u.origin !== window.location.origin) return "/enterprise/reviewer";
      return `${u.pathname}${u.search}${u.hash}`;
    } catch {
      return "/enterprise/reviewer";
    }
  })();

  const [current, setCurrent] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center text-sm text-gray-500 py-16">Loading…</p>;
  }
  if (status === "unauthenticated") {
    return <p className="text-center text-sm text-gray-500 py-16">Redirecting…</p>;
  }

  const token = (session?.user as { accessToken?: string })?.accessToken;
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-sm text-gray-600">Your session does not include an API token. Please sign out and sign in again.</p>
        <Button className="mt-4" variant="outline" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
          Sign out
        </Button>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (nextPw.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (nextPw !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    setBusy(true);
    try {
      const email = (session?.user?.email || "").trim().toLowerCase();
      await authApi.changePassword(current, nextPw, token);
      await signOut({ redirect: false });
      if (!email) {
        router.push("/auth/login");
        return;
      }
      const signed = await signIn("credentials", {
        email,
        password: nextPw,
        redirect: false,
      });
      if (signed?.ok) {
        router.push(callbackUrl);
      } else {
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not update password.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-beige-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-semibold text-brown-950">GlimmoraTeam</span>
        </div>
        <div>
          <h1 className="font-heading text-xl font-semibold text-brown-950 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-teal-600" />
            Set a new password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your administrator provided a temporary password. Choose a new one before continuing to the reviewer workspace.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cur">Current password</Label>
            <Input id="cur" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="nw">New password</Label>
            <Input id="nw" type="password" autoComplete="new-password" value={nextPw} onChange={(e) => setNextPw(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="cf">Confirm new password</Label>
            <Input id="cf" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={busy}>
            {busy ? "Saving…" : "Update password"}
          </Button>
        </form>
        <p className="text-center text-xs text-gray-400">
          After updating, you will be asked to sign in again with your new password.
        </p>
        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-teal-600 hover:text-teal-700">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ChangeTempPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center py-16 text-sm text-gray-500">Loading…</p>}>
      <ChangeTempPasswordInner />
    </Suspense>
  );
}
