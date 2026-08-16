import { cn } from "@/lib/utils";

function getColor(score: number) {
  if (score >= 75) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  if (score >= 25) return "text-orange-500";
  return "text-red-500";
}

function getStroke(score: number) {
  if (score >= 75) return "#00c950";
  if (score >= 50) return "#f0b100";
  if (score >= 25) return "#f97316";
  return "#fb2c36";
}

function getLabel(score: number) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 25) return "Poor";
  return "Critical";
}

export default function ScoreRing({ score = 0 }: { score: number }) {
  const size          = 64;
  const strokeWidth   = 5;
  const r             = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * r;
  const offset        = circumference - (score / 100) * circumference;

  return (
    <div className="flex w-[54px] flex-col items-center gap-2">
      <div className="relative flex size-16 items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={getStroke(score)} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute">
          <span className={cn("text-sm font-medium tabular-nums leading-none", getColor(score))}>
            {score}
          </span>
        </div>
      </div>
      <span className={cn("text-sm font-medium", getColor(score))}>{getLabel(score)}</span>
    </div>
  );
}
