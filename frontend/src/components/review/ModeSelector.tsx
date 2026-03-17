import { cn } from "@/lib/utils";

type ReviewMode = "full" | "security" | "performance" | "clean_code" | "beginner";

const MODES: { value: ReviewMode; label: string }[] = [
  { value: "full",        label: "Full Review"  },
  { value: "security",    label: "Security"     },
  { value: "performance", label: "Performance"  },
  { value: "clean_code",  label: "Clean Code"   },
  { value: "beginner",    label: "Beginner"     },
];

interface Props {
  value:    ReviewMode;
  onChange: (mode: ReviewMode) => void;
}

export default function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-1.5">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={cn(
            "rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap",
            value === mode.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}