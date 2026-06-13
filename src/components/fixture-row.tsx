import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatKickoff } from "@/lib/format";
import type { FixtureOut, FixtureStatus } from "@/lib/types";

const STATUS_LABEL: Record<FixtureStatus, string> = {
  scheduled: "Upcoming",
  live: "Live",
  finished: "FT",
  postponed: "Postponed",
  cancelled: "Cancelled",
};

export function FixtureRow({ fixture }: { fixture: FixtureOut }) {
  const f = fixture;
  const hasScore = f.home_score_90 != null && f.away_score_90 != null;
  const landed = f.is_2_to_4_result === true;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors",
        landed && "result-2to4"
      )}
    >
      <div className="w-28 shrink-0 text-xs text-muted-foreground tabular-nums">
        {formatKickoff(f.kickoff_utc)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{f.home_team.canonical_name}</span>
          {hasScore && (
            <span className="rounded bg-secondary px-1.5 font-bold tabular-nums">
              {f.home_score_90}
            </span>
          )}
          <span className="text-muted-foreground">–</span>
          {hasScore && (
            <span className="rounded bg-secondary px-1.5 font-bold tabular-nums">
              {f.away_score_90}
            </span>
          )}
          <span className="truncate font-medium">{f.away_team.canonical_name}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{f.competition.name}</span>
          {landed && (
            <span className="inline-flex items-center gap-1 font-medium text-success">
              <Check className="size-3" />
              2–4 goals
            </span>
          )}
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
