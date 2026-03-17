import { cn } from "@/lib/utils";

function getColor(score: number) {
  if (score >= 75) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  if (score >= 25) return "text-orange-500";
  return "text-red-500";
}

function getStroke(score: number) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#eab308";
  if (score >= 25) return "#f97316";
  return "#ef4444";
}

function getLabel(score: number) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 25) return "Poor";
  return "Critical";
}

export default function ScoreRing({ score = 0 }: { score: number }) {
  const r            = 36 - 6 / 2;
  const circumference = 2 * Math.PI * r;
  const offset        = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        <svg width={84} height={84} className="-rotate-90">
          <circle cx={42} cy={42} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/50" />
          <circle
            cx={42} cy={42} r={r} fill="none"
            stroke={getStroke(score)} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute">
          <span className={cn("text-xl font-bold tabular-nums leading-none", getColor(score))}>
            {score}
          </span>
        </div>
      </div>
      <span className={cn("text-xs font-medium", getColor(score))}>{getLabel(score)}</span>
    </div>
  );
}