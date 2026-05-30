import {
  CalibrationOutSchema,
  DailyTipsOutSchema,
  FixtureOutSchema,
  StatsSummarySchema,
  TeamDetailSchema,
  TeamWithFeaturesOutSchema,
  type CalibrationOut,
  type DailyTipsOut,
  type FixtureOut,
  type StatsSummary,
  type TeamDetail,
  type TeamWithFeaturesOut,
} from "./types";
import { z } from "zod";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    });
  } catch (e) {
    throw new ApiError(
      0,
      `Network error contacting ${url}. Is the backend running on ${BASE_URL}?`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || res.statusText);
  }

  const json = (await res.json()) as unknown;
  return schema.parse(json);
}

// ---------- Tips ----------

export function getTodaysTips(): Promise<DailyTipsOut> {
  return request("/api/v1/tips/today", DailyTipsOutSchema);
}

export function getTipsForDate(isoDate: string): Promise<DailyTipsOut> {
  const q = new URLSearchParams({ on_date: isoDate });
  return request(`/api/v1/tips?${q}`, DailyTipsOutSchema);
}

// ---------- Fixtures ----------

export function getFixtures(params?: {
  onDate?: string;
  competition?: string;
}): Promise<FixtureOut[]> {
  const q = new URLSearchParams();
  if (params?.onDate) q.set("on_date", params.onDate);
  if (params?.competition) q.set("competition", params.competition);
  const qs = q.toString();
  return request(
    `/api/v1/fixtures${qs ? `?${qs}` : ""}`,
    z.array(FixtureOutSchema)
  );
}

// ---------- Teams ----------

export function searchTeams(params?: {
  q?: string;
  limit?: number;
}): Promise<TeamDetail[]> {
  const q = new URLSearchParams();
  if (params?.q) q.set("q", params.q);
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return request(
    `/api/v1/teams${qs ? `?${qs}` : ""}`,
    z.array(TeamDetailSchema)
  );
}

export function getTeamWithFeatures(
  id: number,
  competition?: string
): Promise<TeamWithFeaturesOut> {
  const q = new URLSearchParams();
  if (competition) q.set("competition", competition);
  const qs = q.toString();
  return request(
    `/api/v1/teams/${id}/features${qs ? `?${qs}` : ""}`,
    TeamWithFeaturesOutSchema
  );
}

// ---------- Stats ----------

export function getStatsSummary(): Promise<StatsSummary> {
  return request("/api/v1/stats/summary", StatsSummarySchema);
}

export function getCalibration(): Promise<CalibrationOut> {
  return request("/api/v1/stats/calibration", CalibrationOutSchema);
}

export { ApiError };
