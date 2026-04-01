"use client";

import { Suspense } from "react";
import OnboardingModal from "./components/OnboardingModal";

export default function ContributorOnboardingPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <Suspense>
        <OnboardingModal />
      </Suspense>
    </div>
  );
}
