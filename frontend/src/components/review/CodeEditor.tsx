import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value:        string;
  onChange:     (val: string) => void;
  placeholder?: string;
}

export default function CodeEditor({ value, onChange, placeholder = "Paste your code here..." }: Props) {
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const lineNumRef   = useRef<HTMLDivElement>(null);
  const lineCount    = Math.max(value.split("\n").length, 1);

  const syncScroll = useCallback(() => {
    if (lineNumRef.current && textareaRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  function handleTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el    = e.currentTarget;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    onChange(value.substring(0, start) + "  " + value.substring(end));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
  }

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg border bg-muted/30 font-mono text-sm">
      {/* Line numbers — scrolls in sync with textarea */}
      <div
        ref={lineNumRef}
        aria-hidden
        className="shrink-0 select-none overflow-hidden border-r bg-muted/50 py-4 text-right text-xs leading-6 text-muted-foreground/50"
        style={{ minWidth: "3rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleTab}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          "h-full w-full resize-none bg-transparent px-4 py-4 text-sm leading-6",
          "placeholder:text-muted-foreground/40 focus:outline-none",
          "text-foreground caret-primary overflow-auto"
        )}
        style={{ fontFamily: "inherit", tabSize: 2 }}
      />
    </div>
  );
}