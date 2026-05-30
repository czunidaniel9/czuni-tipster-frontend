"use client";

import { useQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import { TipCard } from "@/components/tip-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodaysTips } from "@/lib/api";

export default function TipsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tips", "today"],
    queryFn: getTodaysTips,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Today's Tips</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          At most 2 high-confidence tips, generated daily at 07:00 UTC.
          Silence means no opportunity met the threshold.
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
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
          description="No upcoming fixture cleared the confidence threshold. This is intentional — the system stays silent when the data doesn't strongly support a pick."
        />
      )}

      {data && data.tips.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {data.tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      )}
    </div>
  );
}
