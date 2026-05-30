import { Badge } from "@/components/ui/badge";
import { formatKickoff } from "@/lib/format";
import type { FixtureOut, FixtureStatus } from "@/lib/types";

const STATUS_LABEL: Record<FixtureStatus, string> = {
  scheduled: "Upcoming",
  live: "Live",
  finished: "FT",
  postponed: "Postponed",
  cancelled: "Cancelled",
};

interface FixtureRowProps {
  fixture: FixtureOut;
}

export function FixtureRow({ fixture }: FixtureRowProps) {
  const f = fixture;
  const hasScore = f.home_score_90 !== null && f.away_score_90 !== null;

  return (
    <div className="flex items-center gap-4 rounded-md border bg-card px-4 py-3">
      <div className="w-32 shrink-0 text-xs text-muted-foreground tabular-nums">
        {formatKickoff(f.kickoff_utc)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">
            {f.home_team.canonical_name}
          </span>
          {hasScore && (
            <span className="font-bold tabular-nums">{f.home_score_90}</span>
          )}
          <span className="text-muted-foreground">–</span>
          {hasScore && (
            <span className="font-bold tabular-nums">{f.away_score_90}</span>
          )}
          <span className="truncate font-medium">
            {f.away_team.canonical_name}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {f.competition.name}
        </div>
      </div>
      <Badge
        variant={
          f.status === "live"
            ? "destructive"
            : f.status === "finished"
              ? "secondary"
              : "outline"
        }
      >
        {STATUS_LABEL[f.status]}
      </Badge>
    </div>
  );
}
