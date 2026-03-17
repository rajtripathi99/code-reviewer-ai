import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ReviewIssue, IssueSeverity } from "./ReviewPanel";

const SEVERITY_MAP: Record<IssueSeverity, { label: string; cls: string }> = {
  critical:   { label: "Critical",   cls: "bg-red-500/10    text-red-500    border-red-500/20"    },
  warning:    { label: "Warning",    cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  info:       { label: "Info",       cls: "bg-blue-500/10   text-blue-500   border-blue-500/20"   },
  suggestion: { label: "Suggestion", cls: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
};

export default function IssueCard({ issue }: { issue: ReviewIssue }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_MAP[issue.severity] ?? SEVERITY_MAP.info;

  return (
    <div className={cn("rounded-lg border bg-card transition-all", open && "shadow-sm")}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-start gap-3 p-3 text-left"
      >
        <Badge variant="outline" className={cn("mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wide", sev.cls)}>
          {sev.label}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{issue.title}</p>
          {issue.line && <p className="mt-0.5 text-xs text-muted-foreground">Line {issue.line}</p>}
        </div>
        <ChevronDown className={cn("mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t px-3 pb-3 pt-2.5 space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>
          {issue.fix && (
            <div className="rounded-md bg-muted/60 px-3 py-2">
              <p className="text-xs font-semibold text-foreground mb-1">Fix</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{issue.fix}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}