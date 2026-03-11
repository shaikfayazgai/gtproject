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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

  /* Expand all sections by default on mount */
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
      {/* ── Brand + Collapse toggle ── 16px top, 16px bottom */}
      <div className={cn("px-4 pt-4 pb-4", isCollapsed && "px-2 pt-4 pb-3")}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.12 }}
                  className="min-w-0"
                >
                  <p className="text-[13px] font-semibold text-gray-800 tracking-[-0.01em] leading-tight">
                    Glimmora
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {config.shortName}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={toggle}
            className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100/60 transition-colors shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-[14px] h-[14px]" />
            ) : (
              <PanelLeftClose className="w-[14px] h-[14px]" />
            )}
          </button>
        </div>
      </div>

      {/* Separator between brand and nav */}
      {!isCollapsed && <div className="h-px bg-gray-200/40 mx-4 mb-3" />}
      {isCollapsed && <div className="h-px bg-gray-200/40 mx-2 mb-2" />}

      {/* ── Navigation ── px-3 = 12px side padding */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-none">
        <TooltipProvider delayDuration={0}>
          {config.sections.map((section, sIdx) => {
            const isExpanded = expandedSections[sIdx] ?? true;
            const hasSectionTitle = !!section.title;

            return (
              <div
                key={sIdx}
                className={cn(
                  sIdx > 0 && hasSectionTitle && "mt-4",
                  sIdx > 0 && !hasSectionTitle && "mt-1"
                )}
              >
                {/* Section header — 4px vertical padding, 2px bottom margin */}
                {hasSectionTitle && !isCollapsed && (
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="flex items-center justify-between w-full pl-2 pr-2 py-1 mb-0.5 rounded group transition-colors hover:bg-gray-50/80"
                  >
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-500 transition-colors">
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

                {hasSectionTitle && isCollapsed && (
                  <div className="h-px bg-gray-100 mx-2 my-2" />
                )}

                {/* Items */}
                <AnimatePresence initial={false}>
                  {(isExpanded || isCollapsed || !hasSectionTitle) && (
                    <motion.div
                      initial={hasSectionTitle ? { height: 0, opacity: 0 } : false}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
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
                                "group/item relative flex items-center gap-2 rounded-lg py-1.5 text-[13px] transition-all duration-200",
                                isCollapsed ? "justify-center px-1.5" : "px-2",
                                active
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500 hover:text-gray-700"
                              )}
                            >
                              {/* Icon container — 24px box */}
                              <span
                                className={cn(
                                  "flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-all duration-200",
                                  active
                                    ? "bg-brown-500 shadow-sm shadow-brown-500/20"
                                    : "bg-gray-100/60 group-hover/item:bg-gray-100"
                                )}
                              >
                                <Icon
                                  className={cn(
                                    "w-[13px] h-[13px] transition-colors duration-200",
                                    active
                                      ? "text-white"
                                      : "text-gray-400 group-hover/item:text-gray-500"
                                  )}
                                />
                              </span>

                              <AnimatePresence>
                                {!isCollapsed && (
                                  <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="whitespace-nowrap overflow-hidden"
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>

                              {/* Badge */}
                              {item.badge && !isCollapsed && (
                                <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-rose-500 text-[10px] font-bold text-white px-1">
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

      {/* ── Bottom: User profile ── */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="h-px bg-gray-200/40 mb-3" />
          <div className="flex items-center gap-2.5 px-1">
            <Avatar size="sm">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-gray-700 truncate leading-tight">
                Priya Nair
              </p>
              <p className="text-[10px] text-gray-400 truncate leading-tight">
                priya@enterprise.com
              </p>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="px-2 pb-4">
          <div className="h-px bg-gray-200/40 mx-1 mb-2" />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center py-1">
                  <Avatar size="sm">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback>PN</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Priya Nair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: isCollapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 overflow-hidden bg-gradient-to-b from-[#F9F3EE] via-[#FBF8F6] to-white border-r border-gray-200/50"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[240px] z-50 lg:hidden overflow-hidden bg-gradient-to-b from-[#F9F3EE] via-[#FBF8F6] to-white border-r border-gray-200/50 shadow-xl shadow-black/5"
            >
              <button
                onClick={closeMobile}
                className="absolute top-3 right-3 p-1 rounded text-gray-400 hover:text-gray-600 z-20"
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
