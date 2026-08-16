import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewIssue, IssueSeverity } from "./ReviewPanel";

const SEVERITY_MAP: Record<IssueSeverity, { label: string; cls: string }> = {
  critical:   { label: "Critical",   cls: "border-red-300    bg-red-100    text-red-500"    },
  warning:    { label: "Warning",    cls: "border-yellow-300 bg-yellow-100 text-yellow-500" },
  info:       { label: "Info",       cls: "border-blue-300   bg-blue-100   text-blue-500"   },
  suggestion: { label: "Suggestion", cls: "border-violet-300 bg-violet-100 text-violet-500" },
};

export default function IssueCard({ issue }: { issue: ReviewIssue }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_MAP[issue.severity] ?? SEVERITY_MAP.info;

  return (
    <div className={cn("overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50")}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className={cn("shrink-0 rounded-[10px] border px-2 py-0.5 text-xs uppercase tracking-tight", sev.cls)}>
            {sev.label}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm tracking-tight text-gray-900">{issue.title}</p>
            {issue.line != null && (
              <p className="text-[10px] tracking-tight text-gray-400">Line {issue.line}</p>
            )}
          </div>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-2 border-t border-gray-200 px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-gray-600">{issue.description}</p>
          {issue.fix && (
            <div className="rounded-md bg-white px-3 py-2">
              <p className="mb-1 text-xs font-semibold text-gray-900">Fix</p>
              <p className="text-xs leading-relaxed text-gray-600">{issue.fix}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
