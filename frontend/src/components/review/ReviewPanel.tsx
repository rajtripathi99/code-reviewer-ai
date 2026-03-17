import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScoreRing   from "./ScoreRing";
import IssueCard   from "./IssueCard";
import MetricsGrid from "./MetricsGrid";

type ReviewStatus = "idle" | "loading" | "streaming" | "done" | "error";

export type IssueSeverity = "critical" | "warning" | "info" | "suggestion";
export type MetricLevel   = "low" | "medium" | "high";

export interface ReviewIssue {
  id:          string;
  severity:    IssueSeverity;
  title:       string;
  description: string;
  line:        number | null;
  fix:         string;
}

export interface ReviewMetrics {
  complexity:      MetricLevel;
  maintainability: MetricLevel;
  testability:     MetricLevel;
  performance:     MetricLevel;
}

export interface ReviewResult {
  language:      string;
  summary:       string;
  score:         number;
  issues:        ReviewIssue[];
  metrics:       ReviewMetrics;
  rewritten:     string;
  rewrite_notes: string[];
}

interface Props {
  reviewStatus: ReviewStatus;
  result:       ReviewResult | null;
  rawChunks?:   string;
  error?:       string | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Button variant="ghost" size="icon" className="size-7" onClick={copy}>
      {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
    </Button>
  );
}

function StreamingPlaceholder({ chunks }: { chunks: string }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Analysing your code…</span>
      </div>
      <div className="rounded-md bg-muted/40 p-3 font-mono text-[11px] text-muted-foreground leading-relaxed max-h-48 overflow-hidden">
        {chunks || "Waiting for response..."}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4">
        <Skeleton className="size-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

export default function ReviewPanel({ reviewStatus, result, rawChunks = "", error }: Props) {
  const [showRewrite, setShowRewrite] = useState(false);

  if (reviewStatus === "idle") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <p className="text-sm font-medium">No review yet</p>
          <p className="text-xs text-muted-foreground mt-1">Paste your code and hit Review</p>
        </div>
      </div>
    );
  }

  if (reviewStatus === "loading") return <LoadingSkeleton />;
  if (reviewStatus === "streaming" && !result) return <StreamingPlaceholder chunks={rawChunks} />;

  if (reviewStatus === "error") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm font-medium text-destructive">Review failed</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const criticalCount = result.issues?.filter((i) => i.severity === "critical").length ?? 0;
  const warningCount  = result.issues?.filter((i) => i.severity === "warning").length  ?? 0;

  return (
    <div className="space-y-4 p-3 sm:p-4 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start items-center text-center sm:text-left gap-4 rounded-xl border bg-card p-4">
        <ScoreRing score={result.score ?? 0} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{result.language}</span>
            {criticalCount > 0 && (
              <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">{criticalCount} critical</span>
            )}
            {warningCount > 0 && (
              <span className="rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-500">{warningCount} warnings</span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {result.metrics && <MetricsGrid metrics={result.metrics} />}

      {result.issues?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Issues ({result.issues.length})
          </p>
          {result.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {result.rewritten && (
        <div className="space-y-2">
          <button
            onClick={() => setShowRewrite((p) => !p)}
            className="flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-left hover:bg-accent transition-colors"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rewritten Code</span>
            <div className="flex items-center gap-1">
              <CopyButton text={result.rewritten} />
              {showRewrite ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
            </div>
          </button>

          {showRewrite && (
            <div className="rounded-lg border bg-muted/30 overflow-hidden">
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono text-foreground">
                <code>{result.rewritten}</code>
              </pre>
            </div>
          )}

          {showRewrite && result.rewrite_notes?.length > 0 && (
            <ul className="space-y-1 pl-1">
              {result.rewrite_notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-primary/60" />
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}