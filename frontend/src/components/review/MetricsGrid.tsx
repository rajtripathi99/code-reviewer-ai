import { cn } from "@/lib/utils";
import type { ReviewMetrics, MetricLevel } from "./ReviewPanel";

const ITEMS: { key: keyof ReviewMetrics; label: string }[] = [
  { key: "complexity",      label: "Complexity"      },
  { key: "maintainability", label: "Maintainability" },
  { key: "testability",     label: "Testability"     },
  { key: "performance",     label: "Performance"     },
];

const LEVEL_CLASS: Record<MetricLevel, string> = {
  low:    "text-green-500  bg-green-500/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  high:   "text-red-500    bg-red-500/10",
};

export default function MetricsGrid({ metrics }: { metrics: ReviewMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ITEMS.map(({ key, label }) => {
        const level: MetricLevel = metrics[key] ?? "medium";
        return (
          <div key={key} className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <span className={cn("mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-semibold capitalize", LEVEL_CLASS[level])}>
              {level}
            </span>
          </div>
        );
      })}
    </div>
  );
}