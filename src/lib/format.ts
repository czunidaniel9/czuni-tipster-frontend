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
