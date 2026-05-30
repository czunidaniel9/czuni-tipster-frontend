"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { getTeamWithFeatures } from "@/lib/api";
import { formatKickoff } from "@/lib/format";
import type { TeamFeaturesOut } from "@/lib/types";

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold tabular-nums">
        {value ?? "—"}
      </div>
    </div>
  );
}

function FeaturesCard({ f }: { f: TeamFeaturesOut }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <div className="font-semibold">Competition #{f.competition_id}</div>
          <div className="text-xs text-muted-foreground">
            {f.season} · {f.source}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Refreshed {formatKickoff(f.last_refreshed_at)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Form
          </h3>
          <div className="font-mono text-lg tracking-widest">
            {f.form || "—"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Played" value={f.matches_played_total} />
          <Stat label="Wins" value={f.wins_total} />
          <Stat label="Draws" value={f.draws_total} />
          <Stat label="Losses" value={f.losses_total} />
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Goals (per match)
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Scored / total" value={f.goals_for_avg_total?.toFixed(2)} />
            <Stat label="Scored / home" value={f.goals_for_avg_home?.toFixed(2)} />
            <Stat label="Conceded / total" value={f.goals_against_avg_total?.toFixed(2)} />
            <Stat label="Conceded / away" value={f.goals_against_avg_away?.toFixed(2)} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Shape
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Clean sheets" value={f.clean_sheets_total} />
            <Stat label="Failed to score" value={f.failed_to_score_total} />
            <Stat label="Wins (home)" value={f.wins_home} />
            <Stat label="Wins (away)" value={f.wins_away} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamWithFeatures(id),
    enabled: !Number.isNaN(id),
  });

  if (Number.isNaN(id)) {
    return (
      <EmptyState
        icon={Users}
        title="Invalid team ID"
        description="The URL doesn't contain a valid team identifier."
      />
    );
  }

  return (
    <div className="space-y-6">
      {isLoading && (
        <>
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </>
      )}

      {error && (
        <EmptyState
          icon={Users}
          title="Couldn't load team"
          description={error instanceof Error ? error.message : "Unknown error."}
        />
      )}

      {data && (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {data.team.canonical_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.team.country ?? "Country unknown"} · ID {data.team.id}
            </p>
          </div>

          {data.features.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No feature snapshots yet"
              description="This team is in the system but their statistics haven't been fetched. Run the features refresh task on the backend."
            />
          ) : (
            <div className="space-y-4">
              {data.features.map((f) => (
                <FeaturesCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
