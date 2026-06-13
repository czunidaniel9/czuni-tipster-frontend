"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Trophy, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { getTeamsGrouped } from "@/lib/api";

export default function TeamsPage() {
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["teams", "grouped"],
    queryFn: getTeamsGrouped,
  });

  const groups = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.groups;
    return data.groups
      .map((g) => ({
        ...g,
        teams: g.teams.filter((t) =>
          t.canonical_name.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.teams.length > 0);
  }, [data, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Teams grouped by competition / league. Click a team to see its stored
          feature snapshots.
          {data ? ` · ${data.total_teams} teams across ${data.groups.length} competitions` : ""}
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search teams..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          icon={Users}
          title="Couldn't load teams"
          description={error instanceof Error ? error.message : "Unknown error."}
        />
      )}

      {data && groups.length === 0 && (
        <EmptyState
          icon={Users}
          title="No teams found"
          description={
            query
              ? `Nothing matched "${query}".`
              : "Run the ingestion task to populate teams."
          }
        />
      )}

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.competition_code} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="brand-gradient flex size-7 items-center justify-center rounded-md">
                <Trophy className="size-3.5 text-white" />
              </span>
              <h2 className="text-base font-semibold tracking-tight">
                {g.competition_name}
              </h2>
              {g.country && (
                <span className="text-xs text-muted-foreground">{g.country}</span>
              )}
              <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {g.teams.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.teams.map((t) => (
                <Link
                  key={`${g.competition_code}-${t.id}`}
                  href={`/teams/${t.id}`}
                  className="group surface p-4 transition-colors hover:bg-accent"
                >
                  <div className="font-medium group-hover:underline">
                    {t.canonical_name}
                  </div>
                  {t.country && (
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {t.country}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
