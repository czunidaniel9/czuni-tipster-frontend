"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  History,
  type LucideIcon,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

const NAV: NavItem[] = [
  { href: "/tips", label: "Today's Tips", icon: Target, matchPrefix: "/tips" },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/teams", label: "Teams", icon: Users, matchPrefix: "/teams" },
  { href: "/history", label: "History", icon: History },
  { href: "/calibration", label: "Calibration", icon: BarChart3 },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:bg-card/30">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Trophy className="size-5 text-primary" />
        <span className="font-semibold tracking-tight">Tipster</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
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
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">
        v1.0 — single source
      </div>
    </aside>
  );
}

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/30 px-6 md:hidden">
      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-primary" />
        <span className="font-semibold">Tipster</span>
      </div>
      <nav className="flex items-center gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label={item.label}
            >
              <Icon className="size-4" />
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
