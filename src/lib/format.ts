import { format, formatDistanceToNowStrict, parseISO } from "date-fns";
import type { TipMarket, TipSelection } from "./types";

export function formatKickoff(iso: string): string {
  const d = parseISO(iso);
  return format(d, "EEE d MMM, HH:mm 'UTC'");
}

export function formatRelative(iso: string): string {
  const d = parseISO(iso);
  const diff = d.getTime() - Date.now();
  if (Math.abs(diff) < 60_000) return "now";
  return diff > 0
    ? `in ${formatDistanceToNowStrict(d)}`
    : `${formatDistanceToNowStrict(d)} ago`;
}

export function formatPct(p: number, digits = 1): string {
  return `${(p * 100).toFixed(digits)}%`;
}

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

const MARKET_LABELS: Record<TipMarket, string> = {
  goals_2_to_4: "Total goals: 2–4",
  match_winner_90: "Match winner (90 min)",
};

export function marketLabel(m: TipMarket): string {
  return MARKET_LABELS[m] ?? m;
}

export function selectionLabel(
  sel: TipSelection,
  homeName: string,
  awayName: string
): string {
  switch (sel) {
    case "yes":
      return "Yes — 2 to 4 total goals";
    case "home":
      return `${homeName} to win`;
    case "draw":
      return "Draw";
    case "away":
      return `${awayName} to win`;
  }
}

/** Map a probability to a tone (used for confidence colors). */
export function confidenceTone(p: number): "high" | "medium" | "low" {
  if (p >= 0.75) return "high";
  if (p >= 0.65) return "medium";
  return "low";
}

const SECONDARY_LABELS: Record<string, string> = {
  home: "Home win",
  draw: "Draw",
  away: "Away win",
};

export function secondaryLabel(
  sel: string | null | undefined,
  homeName: string,
  awayName: string
): string {
  if (!sel) return "—";
  if (sel === "home") return `${homeName} win`;
  if (sel === "away") return `${awayName} win`;
  return SECONDARY_LABELS[sel] ?? sel;
}

export function cocoSupportLabel(level: string | null | undefined): string {
  if (!level) return "—";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function riskLabel(level: string | null | undefined): string {
  if (!level) return "Unknown";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

/** Tone for a risk level — higher risk is "worse" (warning/destructive). */
export function riskTone(
  level: string | null | undefined
): "low" | "medium" | "high" {
  if (level === "high") return "high";
  if (level === "medium") return "medium";
  return "low";
}

/** Tone for a COCO direction relative to the 2–4 prediction. */
export function cocoTone(
  dir: string | null | undefined
): "good" | "neutral" | "bad" {
  if (dir === "supports") return "good";
  if (dir === "against") return "bad";
  return "neutral";
}

