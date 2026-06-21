"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  Gauge,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { TipCard } from "@/components/tip-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsSummary, getTipsForDate } from "@/lib/api";
import { addDaysIso, dayDate, dayLabel, formatPct, todayIso } from "@/lib/format";
import type { TipOut } from "@/lib/types";

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function DashboardHeader() {
  const { data: stats } = useQuery({
    queryKey: ["stats", "summary"],
    queryFn: getStatsSummary,
  });

  return (
    <div className="space-y-6">
      <div className="surface brand-gradient relative overflow-hidden p-6 text-white md:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Activity className="size-3.5" />
            Multi-layer prediction engine
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Daily Tips Dashboard
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Statistics + Dixon–Coles + COCO Y0 + news &amp; social intelligence.
            Main focus: detecting matches likely to finish with{" "}
            <span className="font-semibold">2–4 total goals</span>.
          </p>
        </div>
        <Target className="absolute -right-6 -top-6 size-48 text-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Target className="size-4" />}
          label="Recommended tips"
          value={stats ? String(stats.total) : "—"}
          sub="all-time"
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          label="Win rate"
          value={stats ? formatPct(stats.win_rate, 0) : "—"}
          sub={stats ? `${stats.won}W · ${stats.lost}L` : undefined}
        />
        <StatCard
          icon={<Gauge className="size-4" />}
          label="Avg confidence"
          value={stats ? formatPct(stats.avg_confidence, 0) : "—"}
          sub="recommended only"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Pending"
          value={stats ? String(stats.pending) : "—"}
          sub="awaiting result"
        />
      </div>
    </div>
  );
}

/** A day sub-header used inside both sections. */
function DayHeading({ iso, count }: { iso: string; count: number }) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-3 first:mt-0">
      <h3 className="text-sm font-semibold tracking-tight">
        {dayLabel(iso)}
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {dayDate(iso)}
        </span>
      </h3>
      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
        {count}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// Window of days shown on the dashboard: yesterday → +2 days. Tips are generated
// for today + tomorrow, so those always appear; yesterday shows recent results.
const WINDOW_OFFSETS = [-1, 0, 1, 2];

export default function TipsPage() {
  const today = todayIso();
  const dates = WINDOW_OFFSETS.map((o) => addDaysIso(today, o));

  const queries = useQueries({
    queries: dates.map((d) => ({
      queryKey: ["tips", d],
      queryFn: () => getTipsForDate(d),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error as Error | undefined;

  const byDate: Record<string, TipOut[]> = {};
  dates.forEach((d, i) => {
    byDate[d] = queries[i]?.data?.tips ?? [];
  });

  const tomorrow = addDaysIso(today, 1);

  // Recommended: always show today + tomorrow (even if empty), plus any other
  // day in the window that has a recommended tip.
  const recommendedDays = dates
    .map((d) => ({ date: d, tips: (byDate[d] ?? []).filter((t) => t.publishable) }))
    .filter(
      ({ date, tips }) => tips.length > 0 || date === today || date === tomorrow
    );

  // Analysed: show any day that has analysed matches.
  const analysedDays = dates
    .map((d) => ({ date: d, tips: (byDate[d] ?? []).filter((t) => !t.publishable) }))
    .filter(({ tips }) => tips.length > 0);

  const anyData = dates.some((d) => (byDate[d] ?? []).length > 0);

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="space-y-10">
        {isLoading && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[26rem] w-full rounded-xl" />
            <Skeleton className="h-[26rem] w-full rounded-xl" />
          </div>
        )}

        {!isLoading && error && (
          <EmptyState
            icon={Target}
            title="Couldn't load tips"
            description={error.message ?? "Unknown error contacting the backend."}
          />
        )}

        {/* RECOMMENDED TIPS — grouped by day */}
        {!isLoading && !error && (
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-5 text-success" />
              <h2 className="text-xl font-bold tracking-tight">Recommended Tips</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              The engine&apos;s actual picks — up to 3 per day, the only ones
              counted in the statistics. Some days have none if nothing clears the
              bar.
            </p>

            {recommendedDays.map(({ date, tips }) => (
              <div key={date}>
                <DayHeading iso={date} count={tips.length} />
                {tips.length > 0 ? (
                  <div className="grid items-start gap-6 lg:grid-cols-2">
                    {tips.map((tip) => (
                      <TipCard key={tip.id} tip={tip} />
                    ))}
                  </div>
                ) : (
                  <div className="surface flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 shrink-0" />
                    No recommended tip on this day — nothing cleared the
                    confidence bar across all layers.
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ANALYSED MATCHES — grouped by day */}
        {!isLoading && !error && analysedDays.length > 0 && (
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Search className="size-5 text-muted-foreground" />
              <h2 className="text-xl font-bold tracking-tight text-muted-foreground">
                Analysed Matches
              </h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Other matches the engine analysed but did not recommend. Shown for
              context — not counted in the statistics.
            </p>

            {analysedDays.map(({ date, tips }) => (
              <div key={date}>
                <DayHeading iso={date} count={tips.length} />
                <div className="grid items-start gap-6 lg:grid-cols-2">
                  {tips.map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {!isLoading && !error && !anyData && (
          <EmptyState
            icon={Target}
            title="No matches in this window"
            description="No covered fixtures around today. New tips are generated each morning at 07:00 UTC."
          />
        )}
      </div>
    </div>
  );
}
