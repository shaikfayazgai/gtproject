"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import type { ModuleConfig } from "@/lib/config/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  config: ModuleConfig;
}

export function Sidebar({ config }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebarStore();
  const [expandedSections, setExpandedSections] = React.useState<
    Record<number, boolean>
  >({});

  React.useEffect(() => {
    const initial: Record<number, boolean> = {};
    config.sections.forEach((_, idx) => {
      initial[idx] = true;
    });
    setExpandedSections(initial);
  }, [config.sections]);

  function toggleSection(idx: number) {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  const allHrefs = React.useMemo(
    () => config.sections.flatMap((s) => s.items.map((i) => i.href)),
    [config.sections]
  );

  function isActive(href: string) {
    if (pathname === href) return true;
    if (
      href === config.basePath + "/dashboard" ||
      href === config.basePath + "/overview"
    )
      return false;
    const hasMoreSpecific = allHrefs.some(
      (h) => h !== href && h.startsWith(href + "/") && pathname.startsWith(h)
    );
    if (hasMoreSpecific) return false;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      <div className={cn("px-5 pt-6 pb-2", isCollapsed && "px-3 pt-5")}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-[-3px] rounded-2xl bg-gradient-to-br from-brown-400/30 via-gold-400/20 to-teal-400/20 blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-brown-500 via-brown-600 to-brown-700 flex items-center justify-center shadow-lg shadow-brown-500/20">
              <Sparkles className="w-[18px] h-[18px] text-gold-200" />
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-[15px] font-bold text-brown-900 tracking-[-0.02em]">
                  Glimmora
                </p>
                <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase mt-[-2px]">
                  {config.shortName}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none">
        <TooltipProvider delayDuration={0}>
          {config.sections.map((section, sIdx) => {
            const isExpanded = expandedSections[sIdx] ?? true;

            return (
              <div key={sIdx} className={sIdx > 0 ? "mt-3" : ""}>
                {/* Section header */}
                {section.title && !isCollapsed && (
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="flex items-center justify-between w-full px-3 py-1.5 mb-0.5 rounded-lg group hover:bg-gray-50/60 transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 group-hover:text-gray-500 transition-colors">
                      {section.title}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown className="w-3 h-3 text-gray-300 group-hover:text-gray-400 transition-colors" />
                    </motion.div>
                  </button>
                )}

                {section.title && isCollapsed && (
                  <div className="mx-2 mb-2 mt-1 border-t border-gray-200/40" />
                )}

                <AnimatePresence initial={false}>
                  {(isExpanded || isCollapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const active = isActive(item.href);
                          const Icon = item.icon;

                          const link = (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => closeMobile()}
                              className={cn(
                                "group/item relative flex items-center gap-3 rounded-xl px-3 py-[9px] text-[13px] font-medium transition-all duration-200",
                                isCollapsed && "justify-center px-2.5",
                                active
                                  ? "bg-white/80 shadow-sm shadow-brown-100/30 border border-brown-200/40"
                                  : "hover:bg-white/40 border border-transparent"
                              )}
                            >
                              {/* Icon */}
                              <div
                                className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                                  active
                                    ? "bg-gradient-to-br from-brown-500 to-brown-600 shadow-sm shadow-brown-400/20"
                                    : "bg-gray-100/80 text-gray-400 group-hover/item:bg-gray-200/60 group-hover/item:text-gray-600 group-hover/item:scale-105"
                                )}
                              >
                                <Icon
                                  className={cn(
                                    "w-[14px] h-[14px] transition-colors duration-200",
                                    active ? "text-white" : ""
                                  )}
                                />
                              </div>

                              <AnimatePresence>
                                {!isCollapsed && (
                                  <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className={cn(
                                      "whitespace-nowrap overflow-hidden transition-colors",
                                      active
                                        ? "text-brown-800 font-semibold"
                                        : "text-gray-500 group-hover/item:text-gray-700"
                                    )}
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>

                              {/* Badge */}
                              {item.badge && !isCollapsed && (
                                <span
                                  className={cn(
                                    "ml-auto text-[10px] font-bold min-w-[22px] text-center py-0.5 px-1.5 rounded-lg",
                                    active
                                      ? "bg-brown-500 text-white"
                                      : "bg-gray-100 text-gray-500 border border-gray-200/50"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );

                          if (isCollapsed) {
                            return (
                              <Tooltip key={item.href}>
                                <TooltipTrigger asChild>{link}</TooltipTrigger>
                                <TooltipContent side="right">
                                  {item.label}
                                </TooltipContent>
                              </Tooltip>
                            );
                          }
                          return (
                            <React.Fragment key={item.href}>
                              {link}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* ── Bottom: collapse toggle ── */}
      <div className="px-3 pb-4">
        {!isCollapsed ? (
          <button
            onClick={toggle}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
            Collapse
          </button>
        ) : (
          <button
            onClick={toggle}
            className="flex items-center justify-center w-full rounded-xl py-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 264 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 overflow-hidden",
          "bg-gradient-to-b from-white/85 via-gray-50/30 to-white/75",
          "backdrop-blur-2xl border-r border-gray-200/50"
        )}
      >
        {/* Subtle ambient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[200px] h-[200px] rounded-full bg-brown-100/20 blur-[60px] -top-[40px] left-[20%]" />
          <div className="absolute w-[150px] h-[150px] rounded-full bg-teal-200/8 blur-[50px] bottom-[20%] right-[-20px]" />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          {sidebarContent}
        </div>
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-900/15 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[264px] z-50 lg:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-r border-gray-200/50"
            >
              <button
                onClick={closeMobile}
                className="absolute top-5 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 z-20"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
