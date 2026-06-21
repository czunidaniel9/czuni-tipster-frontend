"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Brand, NavLinks } from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen">
      {/* Animated aurora backdrop */}
      <div className="aurora" aria-hidden />

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card/40 backdrop-blur-xl md:flex"
      >
        <div className="flex h-16 items-center border-b px-5">
          <Brand />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavLinks />
        </nav>
        <div className="space-y-3 border-t p-4">
          <div className="glass p-3">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Main market
            </div>
            <div className="mt-1 text-sm font-semibold text-success">
              2–4 Total Goals
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">
            v2 · multi-layer engine
          </div>
        </div>
      </motion.aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/70 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <Menu className="size-4" />
            </button>
            <Brand compact />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-sm text-muted-foreground">System live</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute left-0 top-0 flex h-full w-72 flex-col border-r bg-card"
            >
              <div className="flex h-16 items-center justify-between border-b px-5">
                <Brand />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 p-3">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
