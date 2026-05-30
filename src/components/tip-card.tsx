import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfidenceRing } from "@/components/confidence-ring";
import {
  formatKickoff,
  formatRelative,
  marketLabel,
  selectionLabel,
} from "@/lib/format";
import type { TipOut, TipStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  TipStatus,
  { label: string; variant: "secondary" | "success" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "outline" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
  void: { label: "Void", variant: "secondary" },
};

interface TipCardProps {
  tip: TipOut;
}

export function TipCard({ tip }: TipCardProps) {
  const f = tip.fixture;
  const status = STATUS_STYLES[tip.status];
  const sel = selectionLabel(
    tip.selection,
    f.home_team.canonical_name,
    f.away_team.canonical_name
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">#{tip.rank}</Badge>
          <Badge variant="outline">{f.competition.name}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {formatRelative(f.kickoff_utc)}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="truncate text-2xl font-bold tracking-tight">
              {f.home_team.canonical_name}
              <span className="px-3 text-muted-foreground">vs</span>
              {f.away_team.canonical_name}
            </div>
            <div className="mt-1 text-sm text-muted-foreground tabular-nums">
              {formatKickoff(f.kickoff_utc)}
            </div>
          </div>
          <ConfidenceRing value={tip.confidence} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-5 pt-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Market
            </div>
            <div className="mt-1 font-medium">{marketLabel(tip.market)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Recommendation
            </div>
            <div className="mt-1 font-medium">{sel}</div>
          </div>
        </div>

        {tip.short_explanation && (
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Analysis
            </div>
            <p className="text-sm leading-relaxed">{tip.short_explanation}</p>
          </div>
        )}

        {tip.arguments && tip.arguments.length > 0 && (
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Supporting arguments
            </div>
            <ul className="space-y-1.5 text-sm">
              {tip.arguments.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-success" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tip.risk_factors && tip.risk_factors.length > 0 && (
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Risk factors
            </div>
            <ul className="space-y-1.5 text-sm">
              {tip.risk_factors.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-warning" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tip.sources_used && tip.sources_used.length > 0 && (
          <div className="border-t pt-4 text-xs text-muted-foreground">
            Sources: {tip.sources_used.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
