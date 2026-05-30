"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { format, subDays } from "date-fns";
import { TipCard } from "@/components/tip-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsSummary, getTipsForDate } from "@/lib/api";
import { todayIso, formatPct } from "@/lib/format";

export default function HistoryPage() {
  const [date, setDate] = useState(todayIso());

  const { data: tipsData, isLoading: tipsLoading, error: tipsError } = useQuery({
    queryKey: ["tips", date],
    queryFn: () => getTipsForDate(date),
  });

  const { data: stats } = useQuery({
    queryKey: ["stats", "summary"],
    queryFn: getStatsSummary,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All tips ever published, browse by date.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate(format(subDays(new Date(), 1), "yyyy-MM-dd"))}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Yesterday
          </button>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-44"
          />
        </div>
      </div>

      {/* Performance summary */}
      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatBox label="Total" value={stats.total.toString()} />
          <StatBox label="Won" value={stats.won.toString()} tone="success" />
          <StatBox label="Lost" value={stats.lost.toString()} tone="destructive" />
          <StatBox label="Pending" value={stats.pending.toString()} />
          <StatBox
            label="Win rate"
            value={
              stats.won + stats.lost === 0 ? "—" : formatPct(stats.win_rate, 1)
            }
            tone={stats.win_rate >= 0.5 ? "success" : undefined}
          />
        </div>
      )}

      {/* Day's tips */}
      {tipsLoading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      )}

      {tipsError && (
        <EmptyState
          icon={History}
          title="Couldn't load tips for this date"
          description={tipsError instanceof Error ? tipsError.message : "Unknown error."}
        />
      )}

      {tipsData && tipsData.tips.length === 0 && (
        <EmptyState
          icon={History}
          title="No tips on this date"
          description="Either the system was silent that day, or the date predates the system being live."
        />
      )}

      {tipsData && tipsData.tips.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {tipsData.tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
