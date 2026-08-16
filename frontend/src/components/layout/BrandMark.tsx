import { cn } from "@/lib/utils";
import codeSquareIcon from "@/assets/icon-code-square.svg";

interface Props {
  size?: "sm" | "default" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const BOX = {
  sm: "size-5 rounded-[6px]",
  default: "size-[30px] rounded-[10px]",
  lg: "size-10 rounded-[10px]",
};

const ICON = {
  sm: "size-3",
  default: "size-4",
  lg: "size-5",
};

export default function BrandMark({
  size = "default",
  showWordmark = true,
  className,
}: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center overflow-clip bg-black shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]",
          BOX[size]
        )}
      >
        <img
          src={codeSquareIcon}
          alt=""
          width={16}
          height={16}
          className={cn("object-contain", ICON[size])}
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight text-black",
            size === "sm" ? "text-[10px]" : "text-xs"
          )}
        >
          AI Code Reviewer
        </span>
      )}
    </span>
  );
}
