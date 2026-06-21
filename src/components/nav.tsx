"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  History,
  LayoutDashboard,
  type LucideIcon,
  Radar,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

export const NAV: NavItem[] = [
  { href: "/tips", label: "Dashboard", icon: LayoutDashboard, matchPrefix: "/tips" },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/teams", label: "Teams", icon: Users, matchPrefix: "/teams" },
  { href: "/history", label: "Performance", icon: History },
  { href: "/calibration", label: "Calibration", icon: BarChart3 },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/tips" className="group flex items-center gap-2.5">
      <motion.span
        whileHover={{ rotate: 12, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="brand-gradient glow-brand flex size-9 items-center justify-center rounded-xl"
      >
        <Radar className="size-4 text-white" />
      </motion.span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Tipster</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            AI Analytics
          </span>
        </span>
      )}
    </Link>
  );
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          item.matchPrefix !== undefined
            ? pathname.startsWith(item.matchPrefix)
            : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-xl border border-brand/20 bg-accent"
              />
            )}
            <Icon
              className={cn(
                "size-4 transition-colors",
                active
                  ? "text-brand"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
