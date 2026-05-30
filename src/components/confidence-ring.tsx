import { cn } from "@/lib/utils";
import { confidenceTone } from "@/lib/format";

interface ConfidenceRingProps {
  /** value between 0 and 1 */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ConfidenceRing({
  value,
  size = 96,
  strokeWidth = 8,
  className,
}: ConfidenceRingProps) {
  const v = Math.max(0, Math.min(1, value));
  const tone = confidenceTone(v);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - v);

  const colorClass =
    tone === "high"
      ? "text-success"
      : tone === "medium"
        ? "text-warning"
        : "text-destructive";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Confidence ${(v * 100).toFixed(1)}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("fill-none stroke-current transition-all", colorClass)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold tabular-nums">
          {(v * 100).toFixed(0)}
          <span className="text-base font-normal text-muted-foreground">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
