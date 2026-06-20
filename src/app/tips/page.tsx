"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  Gauge,
  Target,
  TrendingUp,
} from "lucide-react";
import { TipCard } from "@/components/tip-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsSummary, getTodaysTips } from "@/lib/api";
import { formatPct } from "@/lib/format";

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
          label="Total tips"
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
          sub="blended"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Pending"
          value={stats ? String(stats.pending) : "—"}
          sub="awaiting settlement"
        />
      </div>
    </div>
  );
}

export default function TipsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tips", "today"],
    queryFn: getTodaysTips,
  });

  const recommended = data?.tips.filter((t) => t.publishable) ?? [];
  const analysed = data?.tips.filter((t) => !t.publishable) ?? [];

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="space-y-8">
        {isLoading && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[28rem] w-full rounded-xl" />
            <Skeleton className="h-[28rem] w-full rounded-xl" />
          </div>
        )}

        {error && (
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

        {data && data.tips.length === 0 && (
          <EmptyState
            icon={Target}
            title="No tips today"
            description="No fixture cleared the confidence threshold across the Poisson/Dixon–Coles, COCO Y0 and news layers. The system stays silent when the data doesn't strongly support a pick."
          />
        )}

        {data && recommended.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                Recommended Tips
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Up to 3 highlighted picks per day — the only ones counted in the
                statistics. Generated daily at 07:00 UTC.
              </p>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {recommended.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </section>
        )}

        {data && analysed.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-muted-foreground">
                Other Analysed Matches
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Matches the engine analysed but did not recommend. Shown for
                context — not counted in the statistics.
              </p>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {analysed.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
