import { z } from "zod";

// ---------- Reference ----------

export const TeamOutSchema = z.object({
  id: z.number().int(),
  canonical_name: z.string(),
  short_name: z.string().nullable().optional(),
});

export const CompetitionOutSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  name: z.string(),
});

// ---------- Fixtures ----------

export const FixtureStatusSchema = z.enum([
  "scheduled",
  "live",
  "finished",
  "postponed",
  "cancelled",
]);

export const FixtureOutSchema = z.object({
  id: z.number().int(),
  competition: CompetitionOutSchema,
  season: z.string(),
  home_team: TeamOutSchema,
  away_team: TeamOutSchema,
  kickoff_utc: z.string(),
  status: FixtureStatusSchema,
  home_score_90: z.number().int().nullable().optional(),
  away_score_90: z.number().int().nullable().optional(),
});

// ---------- Tips ----------

export const TipMarketSchema = z.enum(["goals_2_to_4", "match_winner_90"]);
export const TipSelectionSchema = z.enum(["yes", "home", "draw", "away"]);
export const TipStatusSchema = z.enum(["pending", "won", "lost", "void"]);

export const TipOutSchema = z.object({
  id: z.number().int(),
  fixture: FixtureOutSchema,
  market: TipMarketSchema,
  selection: TipSelectionSchema,
  confidence: z.number().min(0).max(1),
  rank: z.number().int(),
  short_explanation: z.string().nullable().optional(),
  arguments: z.array(z.string()).nullable().optional(),
  risk_factors: z.array(z.string()).nullable().optional(),
  sources_used: z.array(z.string()).nullable().optional(),
  status: TipStatusSchema,
  settled_at: z.string().nullable().optional(),
});

export const DailyTipsOutSchema = z.object({
  date: z.string(),
  tips: z.array(TipOutSchema),
});

// ---------- Teams (detail + features) ----------

export const TeamDetailSchema = TeamOutSchema.extend({
  country: z.string().nullable().optional(),
});

export const TeamFeaturesOutSchema = z.object({
  id: z.number().int(),
  team_id: z.number().int(),
  competition_id: z.number().int(),
  season: z.string(),
  source: z.string(),
  last_refreshed_at: z.string(),

  matches_played_total: z.number().int().nullable().optional(),
  matches_played_home: z.number().int().nullable().optional(),
  matches_played_away: z.number().int().nullable().optional(),

  wins_total: z.number().int().nullable().optional(),
  wins_home: z.number().int().nullable().optional(),
  wins_away: z.number().int().nullable().optional(),

  draws_total: z.number().int().nullable().optional(),
  draws_home: z.number().int().nullable().optional(),
  draws_away: z.number().int().nullable().optional(),

  losses_total: z.number().int().nullable().optional(),
  losses_home: z.number().int().nullable().optional(),
  losses_away: z.number().int().nullable().optional(),

  goals_for_total: z.number().int().nullable().optional(),
  goals_for_avg_total: z.number().nullable().optional(),
  goals_for_avg_home: z.number().nullable().optional(),
  goals_for_avg_away: z.number().nullable().optional(),

  goals_against_total: z.number().int().nullable().optional(),
  goals_against_avg_total: z.number().nullable().optional(),
  goals_against_avg_home: z.number().nullable().optional(),
  goals_against_avg_away: z.number().nullable().optional(),

  clean_sheets_total: z.number().int().nullable().optional(),
  clean_sheets_home: z.number().int().nullable().optional(),
  clean_sheets_away: z.number().int().nullable().optional(),

  failed_to_score_total: z.number().int().nullable().optional(),
  failed_to_score_home: z.number().int().nullable().optional(),
  failed_to_score_away: z.number().int().nullable().optional(),

  form: z.string().nullable().optional(),
});

export const TeamWithFeaturesOutSchema = z.object({
  team: TeamDetailSchema,
  features: z.array(TeamFeaturesOutSchema),
});

// ---------- Stats (Phase 5) ----------

export const MarketStatsSchema = z.object({
  market: z.string(),
  total: z.number().int(),
  won: z.number().int(),
  lost: z.number().int(),
  void: z.number().int(),
  pending: z.number().int(),
  win_rate: z.number().min(0).max(1),
  avg_confidence: z.number().min(0).max(1),
});

export const StatsSummarySchema = z.object({
  total: z.number().int(),
  won: z.number().int(),
  lost: z.number().int(),
  void: z.number().int(),
  pending: z.number().int(),
  win_rate: z.number().min(0).max(1),
  avg_confidence: z.number().min(0).max(1),
  by_market: z.array(MarketStatsSchema),
});

export const CalibrationBucketSchema = z.object({
  label: z.string(),
  predicted_midpoint: z.number(),
  settled_count: z.number().int(),
  won: z.number().int(),
  actual_win_rate: z.number().nullable(),
});

export const CalibrationOutSchema = z.object({
  buckets: z.array(CalibrationBucketSchema),
  overall_settled: z.number().int(),
  overall_win_rate: z.number().nullable(),
});

// ---------- Inferred TS types ----------

export type TeamOut = z.infer<typeof TeamOutSchema>;
export type CompetitionOut = z.infer<typeof CompetitionOutSchema>;
export type FixtureStatus = z.infer<typeof FixtureStatusSchema>;
export type FixtureOut = z.infer<typeof FixtureOutSchema>;
export type TipMarket = z.infer<typeof TipMarketSchema>;
export type TipSelection = z.infer<typeof TipSelectionSchema>;
export type TipStatus = z.infer<typeof TipStatusSchema>;
export type TipOut = z.infer<typeof TipOutSchema>;
export type DailyTipsOut = z.infer<typeof DailyTipsOutSchema>;
export type TeamDetail = z.infer<typeof TeamDetailSchema>;
export type TeamFeaturesOut = z.infer<typeof TeamFeaturesOutSchema>;
export type TeamWithFeaturesOut = z.infer<typeof TeamWithFeaturesOutSchema>;
export type MarketStats = z.infer<typeof MarketStatsSchema>;
export type StatsSummary = z.infer<typeof StatsSummarySchema>;
export type CalibrationBucket = z.infer<typeof CalibrationBucketSchema>;
export type CalibrationOut = z.infer<typeof CalibrationOutSchema>;
