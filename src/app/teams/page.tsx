"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { searchTeams } from "@/lib/api";

export default function TeamsPage() {
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["teams", query],
    queryFn: () => searchTeams({ q: query || undefined, limit: 100 }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Canonical teams known to the system. Click into one to see their
          stored feature snapshots.
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
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

      {data && data.length === 0 && (
        <EmptyState
          icon={Users}
          title="No teams found"
          description={
            query
              ? `Nothing matched "${query}". Try a different query.`
              : "Run the ingestion task to populate teams."
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => (
            <Link
              key={t.id}
              href={`/teams/${t.id}`}
              className="group rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
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
      )}
    </div>
  );
}
