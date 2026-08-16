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
    <div className="flex flex-wrap gap-2">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={cn(
            "rounded-[5px] px-2 py-0.5 text-xs tracking-tight whitespace-nowrap transition-colors",
            value === mode.value
              ? "bg-gray-950 text-gray-50"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
