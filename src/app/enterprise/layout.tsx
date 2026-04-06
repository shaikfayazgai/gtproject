"use client";

import { usePathname } from "next/navigation";
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
  const pendingOnboarding = useAuthStore((s) => s.pendingOnboarding);
  const isOnboarding = pathname.startsWith("/enterprise/onboarding");

  // Only show the onboarding wizard when the user came through the register page SSO buttons.
  const showOnboarding = isOnboarding || pendingOnboarding;

  return (
    <>
      <AppShell config={enterpriseNav}>
        {isOnboarding ? null : children}
      </AppShell>
      {showOnboarding && <OnboardingModal />}
    </>
  );
}
