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
    <div className="flex h-full w-full overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50 font-mono text-sm">
      {/* Line numbers — scrolls in sync with textarea */}
      <div
        ref={lineNumRef}
        aria-hidden
        className="w-7 shrink-0 select-none overflow-hidden border-r border-gray-200 py-3 text-center text-[10px] leading-5 text-gray-400"
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
          "h-full w-full resize-none bg-transparent px-3 py-3 text-sm leading-5",
          "placeholder:text-gray-400 focus:outline-none",
          "text-foreground caret-black overflow-auto"
        )}
        style={{ fontFamily: "inherit", tabSize: 2 }}
      />
    </div>
  );
}