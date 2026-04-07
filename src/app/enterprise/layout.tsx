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
  const pendingOnboarding = useAuthStore((s) => s.pendingOnboarding);
  const isOnboarding = pathname.startsWith("/enterprise/onboarding");

  // Only show the onboarding wizard for SSO users (google/microsoft), never for manual registrations.
  const isSSO = session?.user?.provider === "google" || session?.user?.provider === "microsoft";
  const showOnboarding = (isOnboarding || pendingOnboarding) && isSSO;

  return (
    <>
      <AppShell config={enterpriseNav}>
        {isOnboarding ? null : children}
      </AppShell>
      {showOnboarding && <OnboardingModal />}
    </>
  );
}
