"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout";
import { enterpriseNav } from "@/lib/config/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import OnboardingModal from "./onboarding/components/OnboardingModal";

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isOnboardingComplete = useAuthStore((s) => s.isOnboardingComplete);
  const isOnboarding = pathname.startsWith("/enterprise/onboarding");

  // Onboarding wizard is only for SSO users on their first login.
  // Credentials (manual registration) users have already completed their profile during sign-up.
  const isSSO = session?.user?.provider !== "credentials";
  const showOnboarding = isOnboarding || (isSSO && !isOnboardingComplete);

  return (
    <>
      <AppShell config={enterpriseNav}>
        {isOnboarding ? null : children}
      </AppShell>
      {showOnboarding && <OnboardingModal />}
    </>
  );
}
