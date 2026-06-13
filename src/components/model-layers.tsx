import { Activity, BrainCircuit, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { cocoSupportLabel, cocoTone, formatPct, riskLabel, riskTone } from "@/lib/format";
import type { TipOut } from "@/lib/types";

function LayerTile({
  icon,
  label,
  value,
  hint,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "good" | "bad" | "warn";
}) {
  const toneRing = {
    neutral: "border-border",
    good: "border-success/50",
    bad: "border-destructive/50",
    warn: "border-warning/50",
  }[tone];
  const toneText = {
    neutral: "text-foreground",
    good: "text-success",
    bad: "text-destructive",
    warn: "text-warning",
  }[tone];
  return (
    <div className={cn("rounded-lg border bg-background/40 p-3", toneRing)}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className={cn("mt-1.5 text-lg font-semibold tabular-nums", toneText)}>
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

/** The three model layers shown as separate visual elements. */
export function ModelLayers({ tip }: { tip: TipOut }) {
  const ct = cocoTone(tip.coco_direction);
  const rt = riskTone(tip.news_risk_level);

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      <LayerTile
        icon={<Activity className="size-3.5" />}
        label="Poisson / Dixon–Coles"
        value={
          tip.poisson_confidence != null ? formatPct(tip.poisson_confidence, 0) : "—"
        }
        hint="P(2–4 goals), corrected"
      />
      <LayerTile
        icon={<BrainCircuit className="size-3.5" />}
        label="COCO Y0"
        value={cocoSupportLabel(tip.coco_support_level)}
        hint={
          tip.coco_score != null
            ? `score ${formatPct(tip.coco_score, 0)} · ${tip.coco_direction ?? ""}`
            : undefined
        }
        tone={ct === "good" ? "good" : ct === "bad" ? "bad" : "neutral"}
      />
      <LayerTile
        icon={<ShieldAlert className="size-3.5" />}
        label="News / Social risk"
        value={riskLabel(tip.news_risk_level)}
        hint={tip.news_summary ?? undefined}
        tone={rt === "high" ? "bad" : rt === "medium" ? "warn" : "good"}
      />
    </div>
  );
}
