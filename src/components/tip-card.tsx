import {
  CheckCircle2,
  CircleSlash,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfidenceRing } from "@/components/confidence-ring";
import { ModelLayers } from "@/components/model-layers";
import { HoverLift } from "@/components/motion";
import { cn } from "@/lib/utils";
import {
  formatKickoff,
  formatRelative,
  secondaryLabel,
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

export function TipCard({ tip }: { tip: TipOut }) {
  const f = tip.fixture;
  const status = STATUS_STYLES[tip.status];
  const secondary = secondaryLabel(
    tip.secondary_selection,
    f.home_team.canonical_name,
    f.away_team.canonical_name
  );
  const hasScore = f.home_score_90 != null && f.away_score_90 != null;
  const totalGoals =
    f.total_goals ??
    (hasScore ? (f.home_score_90 ?? 0) + (f.away_score_90 ?? 0) : null);
  const landed = f.is_2_to_4_result === true;
  // Defensive: the main market is always 2–4 goals, but guard legacy rows.
  const isMainMarket = tip.market === "goals_2_to_4";
  const recommended = tip.publishable === true;

  return (
    <HoverLift
      className={cn(
        "surface flex flex-col overflow-hidden transition-all duration-300",
        recommended
          ? "ring-1 ring-success/40 shadow-[0_8px_40px_-16px_hsl(152_60%_45%/0.5)]"
          : "opacity-90 hover:opacity-100"
      )}
    >
      {/* Recommended / Analysed banner */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider",
          recommended
            ? "bg-success/10 text-success"
            : "bg-muted text-muted-foreground"
        )}
      >
        {recommended ? (
          <>
            <Sparkles className="size-3.5" /> Recommended tip
          </>
        ) : (
          <>Analysed match</>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 px-5 pt-4">
        {recommended && (
          <Badge variant="secondary" className="tabular-nums">
            #{tip.rank}
          </Badge>
        )}
        <Badge variant="outline">{f.competition.name}</Badge>
        <Badge variant={status.variant}>{status.label}</Badge>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {formatRelative(f.kickoff_utc)}
        </span>
      </div>

      {/* Matchup */}
      <div className="px-5 pb-4 pt-3">
        <div className="text-xl font-bold leading-tight tracking-tight">
          {f.home_team.canonical_name}
          <span className="px-2 font-normal text-muted-foreground">vs</span>
          {f.away_team.canonical_name}
        </div>
        <div className="mt-1 text-xs text-muted-foreground tabular-nums">
          {formatKickoff(f.kickoff_utc)}
        </div>
      </div>

      {/* MAIN MARKET — 2–4 total goals (highlighted only when recommended) */}
      <div
        className={cn(
          "mx-5 rounded-xl border p-4",
          recommended ? "border-success/40 bg-success/5" : "border-border bg-muted/40"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider",
                recommended ? "text-success" : "text-muted-foreground"
              )}
            >
              <Target className="size-3.5" />
              {recommended ? "Main tip" : "Main market"}
            </div>
            <div className="mt-1 text-lg font-bold">
              {isMainMarket ? "2–4 Total Goals" : "Match outcome"}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Regular-time total match goals
            </div>
          </div>
          <ConfidenceRing value={tip.confidence} size={84} strokeWidth={7} />
        </div>

        {/* Final result strip for settled / finished matches */}
        {hasScore && (
          <div className="mt-3 flex items-center justify-between border-t border-success/30 pt-3 text-sm">
            <span className="text-muted-foreground">
              Full time:{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {f.home_score_90}–{f.away_score_90}
              </span>
              <span className="ml-2 tabular-nums">{totalGoals} goals</span>
            </span>
            <span
              className={
                landed
                  ? "inline-flex items-center gap-1 font-medium text-success"
                  : "inline-flex items-center gap-1 font-medium text-destructive"
              }
            >
              {landed ? (
                <>
                  <CheckCircle2 className="size-4" /> In 2–4 range
                </>
              ) : (
                <>
                  <CircleSlash className="size-4" /> Outside 2–4
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* SECONDARY MARKET — 1X2, separate */}
      <div className="mx-5 mt-3 flex items-center justify-between rounded-lg border bg-background/40 px-4 py-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <TrendingUp className="size-3.5" />
          Secondary
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{secondary}</span>
          {tip.secondary_confidence != null && (
            <span className="tabular-nums text-muted-foreground">
              {(tip.secondary_confidence * 100).toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Model layers */}
      <div className="mt-4 px-5">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Model transparency
        </div>
        <ModelLayers tip={tip} />
      </div>

      {/* Final decision */}
      {tip.decision_reason && (
        <div
          className={cn(
            "mx-5 mt-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm",
            tip.publishable
              ? "border-success/40 bg-success/5"
              : "border-warning/40 bg-warning/5"
          )}
        >
          {tip.publishable ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
          ) : (
            <CircleSlash className="mt-0.5 size-4 shrink-0 text-warning" />
          )}
          <div>
            <div className="font-medium">
              {tip.publishable ? "Publishable tip" : "Held back"}
            </div>
            <div className="text-muted-foreground">{tip.decision_reason}</div>
          </div>
        </div>
      )}

      {/* Analysis */}
      {tip.short_explanation && (
        <div className="px-5 pt-4">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Why 2–4 goals
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {tip.short_explanation}
          </p>
        </div>
      )}

      <div className="grid gap-4 px-5 pt-4 sm:grid-cols-2">
        {tip.arguments && tip.arguments.length > 0 && (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Supporting arguments
            </div>
            <ul className="space-y-1.5 text-sm">
              {tip.arguments.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                  <span className="text-foreground/90">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tip.risk_factors && tip.risk_factors.length > 0 && (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Risk factors
            </div>
            <ul className="space-y-1.5 text-sm">
              {tip.risk_factors.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                  <span className="text-foreground/90">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {tip.sources_used && tip.sources_used.length > 0 && (
        <div className="mt-5 border-t px-5 py-3 text-xs text-muted-foreground">
          Layers: {tip.sources_used.join(" · ")}
        </div>
      )}
    </HoverLift>
  );
}
