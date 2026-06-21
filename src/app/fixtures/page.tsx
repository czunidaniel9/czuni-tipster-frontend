"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { FixtureRow } from "@/components/fixture-row";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getFixtures } from "@/lib/api";
import { todayIso } from "@/lib/format";
import type { FixtureOut } from "@/lib/types";

const COMP_ORDER = [
  "PL", "ELC", "LL", "BL", "SA", "L1", "ERE", "UCL", "UEL", "UECL", "WC",
];

function groupByCompetition(fixtures: FixtureOut[]) {
  const map = new Map<string, { name: string; code: string; items: FixtureOut[] }>();
  for (const f of fixtures) {
    const key = f.competition.code;
    if (!map.has(key)) {
      map.set(key, { name: f.competition.name, code: f.competition.code, items: [] });
    }
    map.get(key)!.items.push(f);
  }
  return Array.from(map.values()).sort((a, b) => {
    const ai = COMP_ORDER.indexOf(a.code);
    const bi = COMP_ORDER.indexOf(b.code);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.name.localeCompare(b.name);
  });
}

function shiftDate(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function FixturesPage() {
  const [date, setDate] = useState(todayIso());

  const { data, isLoading, error } = useQuery({
    queryKey: ["fixtures", date],
    queryFn: () => getFixtures({ onDate: date }),
  });

  const grouped = useMemo(() => (data ? groupByCompetition(data) : []), [data]);
  const landedCount = useMemo(
    () => (data ? data.filter((f) => f.is_2_to_4_result).length : 0),
    [data]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fixtures</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Matches in covered competitions (UTC). Matches that finished with{" "}
            <span className="font-medium text-success">2–4 total goals</span> are
            highlighted green.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => setDate((d) => shiftDate(d, -1))}
            className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-40"
          />
          <button
            type="button"
            aria-label="Next day"
            onClick={() => setDate((d) => shiftDate(d, 1))}
            className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {data && data.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded result-2to4 border" />
            {landedCount} of {data.length} landed in 2–4 goals
          </span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          icon={CalendarDays}
          title="Couldn't load fixtures"
          description={error instanceof Error ? error.message : "Unknown error."}
        />
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="No fixtures on this date"
          description="None of the enabled competitions had matches on this day. Use the arrows to browse other days, or ask an admin to backfill historical fixtures (e.g. a Champions League final)."
        />
      )}

      {grouped.length > 0 && (
        <div className="space-y-6">
          {grouped.map((g, gi) => (
            <Reveal key={g.code} delay={gi * 0.04}>
              <section className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {g.name}
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {g.items.length}
                  </span>
                </h2>
                <Stagger className="space-y-2">
                  {g.items.map((f) => (
                    <StaggerItem key={f.id}>
                      <FixtureRow fixture={f} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
