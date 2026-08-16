import { cn } from "@/lib/utils";
import type { ReviewMetrics, MetricLevel } from "./ReviewPanel";

const ITEMS: { key: keyof ReviewMetrics; label: string }[] = [
  { key: "complexity",      label: "Complexity"      },
  { key: "performance",     label: "Performance"     },
  { key: "testability",     label: "Testability"     },
  { key: "maintainability", label: "Maintainability" },
];

const LEVEL_CLASS: Record<MetricLevel, string> = {
  low:    "bg-green-100  text-green-500",
  medium: "bg-yellow-100 text-yellow-500",
  high:   "bg-red-100    text-red-500",
};

export default function MetricsGrid({ metrics }: { metrics: ReviewMetrics }) {
  return (
    <div className="flex w-full gap-2.5 overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50 p-4">
      {ITEMS.map(({ key, label }) => {
        const level: MetricLevel = metrics[key] ?? "medium";
        return (
          <div key={key} className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <p className="truncate text-sm text-gray-400">{label}</p>
            <span className={cn("inline-flex rounded-[10px] px-2 py-0.5 text-xs font-medium capitalize", LEVEL_CLASS[level])}>
              {level}
            </span>
          </div>
        );
      })}
    </div>
  );
}
