"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { TipCard } from "@/components/tip-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsSummary, getTipsForDate } from "@/lib/api";
import { addDaysIso, dayDate, dayLabel, formatPct, todayIso } from "@/lib/format";

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

export default function TipsPage() {
  const [date, setDate] = useState(todayIso());

  const { data, isLoading, error } = useQuery({
    queryKey: ["tips", date],
    queryFn: () => getTipsForDate(date),
  });

  const tips = data?.tips ?? [];
  const recommended = tips.filter((t) => t.publishable);
  const analysed = tips.filter((t) => !t.publishable);

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {/* Date navigation — pick any day to look back at what happened */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {dayLabel(date)}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {dayDate(date)}
            </span>
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Recommended tips and analysed matches for the selected day.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => setDate((d) => addDaysIso(d, -1))}
            className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value || todayIso())}
            className="w-40"
          />
          <button
            type="button"
            aria-label="Next day"
            onClick={() => setDate((d) => addDaysIso(d, 1))}
            className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
          {date !== todayIso() && (
            <button
              type="button"
              onClick={() => setDate(todayIso())}
              className="rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Today
            </button>
          )}
        </div>
      </div>

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
            description={
              error instanceof Error
                ? error.message
                : "Unknown error contacting the backend."
            }
          />
        )}

        {/* RECOMMENDED TIPS for the selected day */}
        {!isLoading && !error && (
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-5 text-success" />
              <h3 className="text-lg font-bold tracking-tight">Recommended Tips</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {recommended.length}
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              The engine&apos;s actual picks — up to 3 per day, the only ones
              counted in the statistics.
            </p>

            {recommended.length > 0 ? (
              <div className="grid items-start gap-6 lg:grid-cols-2">
                {recommended.map((tip) => (
                  <TipCard key={tip.id} tip={tip} />
                ))}
              </div>
            ) : (
              <div className="surface flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 shrink-0" />
                No recommended tip on this day — nothing cleared the confidence bar
                across all layers.
              </div>
            )}
          </section>
        )}

        {/* ANALYSED MATCHES for the selected day */}
        {!isLoading && !error && (
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Search className="size-5 text-muted-foreground" />
              <h3 className="text-lg font-bold tracking-tight text-muted-foreground">
                Analysed Matches
              </h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {analysed.length}
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Other matches the engine analysed but did not recommend. Shown for
              context — not counted in the statistics.
            </p>

            {analysed.length > 0 ? (
              <div className="grid items-start gap-6 lg:grid-cols-2">
                {analysed.map((tip) => (
                  <TipCard key={tip.id} tip={tip} />
                ))}
              </div>
            ) : (
              <div className="surface px-4 py-3 text-sm text-muted-foreground">
                No analysed matches stored for this day.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
