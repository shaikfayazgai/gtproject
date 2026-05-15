"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface UseNavigationGuardOptions {
  isActive: boolean;
  allowedPathPrefixes?: string[];
}

interface NavigationGuardResult {
  showModal: boolean;
  pendingUrl: string | null;
  /** Navigate to the pending URL (data stays in storage) */
  onConfirmLeave: () => void;
  /** Close modal and stay on the current page */
  onStay: () => void;
}

export function useNavigationGuard({
  isActive,
  allowedPathPrefixes = [],
}: UseNavigationGuardOptions): NavigationGuardResult {
  const router = useRouter();

  const [showModal, setShowModal] = React.useState(false);
  const [pendingUrl, setPendingUrl] = React.useState<string | null>(null);

  // Keep a ref so the event listener always sees the latest value without re-registering
  const isActiveRef = React.useRef(isActive);
  React.useEffect(() => { isActiveRef.current = isActive; }, [isActive]);

  // ── Click interceptor (capture phase) ──────────────────────────────────────
  // Runs BEFORE Next.js <Link>'s bubble-phase handler, so e.stopPropagation()
  // prevents the Link from calling router.push() at all.
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isActiveRef.current) return;

      // Walk up to find the nearest anchor
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore: hash links, mailto, tel, javascript, and external URLs
      if (
        href === "#" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        href.startsWith("http") ||
        href.startsWith("//")
      ) return;

      // Derive the path portion for prefix matching
      const targetPath = href.split("?")[0].split("#")[0];

      // Allow navigation that stays within the allowed prefixes
      const isAllowed = allowedPathPrefixes.some(
        (prefix) => targetPath.startsWith(prefix) || href.startsWith(prefix)
      );
      if (isAllowed) return;

      // Block this navigation and show the guard modal
      e.preventDefault();
      e.stopPropagation();
      setPendingUrl(href);
      setShowModal(true);
    };

    // Capture phase — fires before any React event handler
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Browser close / refresh ────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isActive) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isActive]);

  // ── Confirm leave ──────────────────────────────────────────────────────────
  const onConfirmLeave = React.useCallback(() => {
    setShowModal(false);
    const url = pendingUrl;
    setPendingUrl(null);
    if (url) {
      // Disable guard before navigating so the push isn't intercepted again
      isActiveRef.current = false;
      router.push(url);
    }
  }, [pendingUrl, router]);

  // ── Stay on page ───────────────────────────────────────────────────────────
  const onStay = React.useCallback(() => {
    setShowModal(false);
    setPendingUrl(null);
  }, []);

  return { showModal, pendingUrl, onConfirmLeave, onStay };
}
