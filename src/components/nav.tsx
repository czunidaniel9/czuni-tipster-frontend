"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <Link href="/tips" className="flex items-center gap-2.5">
      <span className="brand-gradient flex size-8 items-center justify-center rounded-lg shadow-sm">
        <Radar className="size-4 text-white" />
      </span>
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
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-4 transition-colors",
                active ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
