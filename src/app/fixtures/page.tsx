"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { FixtureRow } from "@/components/fixture-row";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getFixtures } from "@/lib/api";
import { todayIso } from "@/lib/format";
import type { FixtureOut } from "@/lib/types";

function groupByCompetition(
  fixtures: FixtureOut[]
): { name: string; code: string; items: FixtureOut[] }[] {
  const map = new Map<string, { name: string; code: string; items: FixtureOut[] }>();
  for (const f of fixtures) {
    const key = f.competition.code;
    if (!map.has(key)) {
      map.set(key, {
        name: f.competition.name,
        code: f.competition.code,
        items: [],
      });
    }
    map.get(key)!.items.push(f);
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function FixturesPage() {
  const [date, setDate] = useState(todayIso());

  const { data, isLoading, error } = useQuery({
    queryKey: ["fixtures", date],
    queryFn: () => getFixtures({ onDate: date }),
  });

  const grouped = useMemo(() => (data ? groupByCompetition(data) : []), [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixtures</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All matches in the covered competitions on a given day (UTC).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="date" className="text-sm text-muted-foreground">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-44"
          />
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          icon={CalendarDays}
          title="Couldn't load fixtures"
          description={
            error instanceof Error ? error.message : "Unknown error."
          }
        />
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="No fixtures on this date"
          description="None of the enabled competitions had matches scheduled on this day."
        />
      )}

      {grouped.length > 0 && (
        <div className="space-y-6">
          {grouped.map((g) => (
            <section key={g.code} className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {g.name} <span className="text-xs">({g.items.length})</span>
              </h2>
              <div className="space-y-2">
                {g.items.map((f) => (
                  <FixtureRow key={f.id} fixture={f} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
