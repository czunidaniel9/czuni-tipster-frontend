"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { getCalibration } from "@/lib/api";

export default function CalibrationPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stats", "calibration"],
    queryFn: getCalibration,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calibration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Predicted confidence buckets compared against actual win rates. A
          well-calibrated model lands close to the diagonal.
        </p>
      </div>

      {isLoading && <Skeleton className="h-96 w-full" />}

      {error && (
        <EmptyState
          icon={BarChart3}
          title="Couldn't load calibration data"
          description={error instanceof Error ? error.message : "Unknown error."}
        />
      )}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Settled tips"
              value={data.overall_settled.toString()}
            />
            <SummaryCard
              label="Overall win rate"
              value={
                data.overall_win_rate === null
                  ? "—"
                  : `${(data.overall_win_rate * 100).toFixed(1)}%`
              }
            />
            <SummaryCard
              label="Buckets with data"
              value={`${data.buckets.filter((b) => b.settled_count > 0).length} / ${data.buckets.length}`}
            />
          </div>

          {data.overall_settled === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No settled tips yet"
              description="Once matches finish and the settlement task runs, this page will populate with predicted-vs-actual buckets."
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Confidence buckets vs actual win rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={data.buckets.map((b) => ({
                        ...b,
                        actual_pct:
                          b.actual_win_rate === null
                            ? null
                            : b.actual_win_rate,
                      }))}
                      margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="label"
                        className="text-xs"
                        stroke="currentColor"
                      />
                      <YAxis
                        domain={[0, 1]}
                        tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                        className="text-xs"
                        stroke="currentColor"
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                        formatter={(v: number, name: string) => {
                          if (v === null || v === undefined) return ["—", name];
                          return [`${(v * 100).toFixed(1)}%`, name];
                        }}
                      />
                      <Bar
                        dataKey="predicted_midpoint"
                        name="Predicted (midpoint)"
                        fill="hsl(var(--muted))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual_pct"
                        name="Actual win rate"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        connectNulls
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Grey bars = predicted confidence (midpoint of each bucket).
                  Green line = actual win rate among settled tips that fell
                  into that bucket. They should track close to each other if
                  the model is well calibrated.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bucket detail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 font-medium">Bucket</th>
                      <th className="py-2 font-medium tabular-nums">Settled</th>
                      <th className="py-2 font-medium tabular-nums">Won</th>
                      <th className="py-2 font-medium tabular-nums">
                        Win rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.buckets.map((b) => (
                      <tr key={b.label} className="border-b last:border-0">
                        <td className="py-2 font-medium">{b.label}</td>
                        <td className="py-2 tabular-nums">{b.settled_count}</td>
                        <td className="py-2 tabular-nums">{b.won}</td>
                        <td className="py-2 tabular-nums">
                          {b.actual_win_rate === null
                            ? "—"
                            : `${(b.actual_win_rate * 100).toFixed(1)}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}
