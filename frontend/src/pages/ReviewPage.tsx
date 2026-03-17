import { useState, useEffect, useRef } from "react";
import { Button }     from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar         from "../components/layout/Navbar";
import CodeEditor     from "../components/review/CodeEditor";
import ModeSelector   from "../components/review/ModeSelector";
import ReviewPanel    from "../components/review/ReviewPanel";
import { useReview }  from "../hooks/useReview";
import { Sparkles, X } from "lucide-react";

type ReviewMode = "full" | "security" | "performance" | "clean_code" | "beginner";

const LANGUAGES = [
  "Auto detect", "JavaScript", "TypeScript", "Python", "Java", "Go",
  "Rust", "C", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "SQL",
];

const STORAGE_KEY = "codereview_session";

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function ReviewPage() {
  // Load saved session once using a ref so it doesn't re-read on every render
  const savedRef = useRef(loadSession());
  const saved = savedRef.current;

  const [code, setCode]         = useState(saved?.code ?? "");
  const [mode, setMode]         = useState<ReviewMode>(saved?.mode ?? "full");
  const [language, setLanguage] = useState(saved?.language ?? "Auto detect");

  const { status: reviewStatus, result, rawChunks, error, submitStream, reset } = useReview(saved?.result ?? null);

  // Save to sessionStorage whenever review completes
  useEffect(() => {
    if (reviewStatus === "done" && result) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ code, mode, language, result }));
    }
  }, [reviewStatus, result, code, mode, language]);

  const isRunning = reviewStatus === "streaming" || reviewStatus === "loading";

  async function handleReview() {
    if (!code.trim() || isRunning) return;
    await submitStream(code, mode, language === "Auto detect" ? "" : language);
  }

  function handleReset() {
    reset();
    setCode("");
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <Navbar />

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="border-b bg-card/50 px-3 sm:px-4 py-2 sm:py-2.5 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <ModeSelector value={mode} onChange={setMode} />

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 w-28 sm:w-36 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {reviewStatus !== "idle" && (
                <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={handleReset}>
                  <X className="size-4" />
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleReview}
                disabled={!code.trim() || isRunning}
                className="h-8 gap-1.5 shrink-0"
              >
                <Sparkles className="size-3.5" />
                {isRunning ? "Reviewing…" : "Review"}
              </Button>
            </div>
          </div>
        </div>

        {/* Split panel */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">

          {/* Left — code editor */}
          <div className="flex w-full lg:w-1/2 flex-col overflow-hidden border-b lg:border-b-0 lg:border-r p-3 sm:p-4 min-h-[35vh] lg:min-h-0">
            <div className="mb-2 flex items-center justify-between shrink-0">
              <span className="text-xs font-medium text-muted-foreground">Code</span>
              {code && (
                <span className="text-xs text-muted-foreground">
                  {code.split("\n").length} lines
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor value={code} onChange={setCode} />
            </div>
          </div>

          {/* Right — review results */}
          <div className="flex w-full lg:w-1/2 flex-col overflow-hidden min-h-[40vh] lg:min-h-0">
            <ScrollArea className="h-full">
              <ReviewPanel
                reviewStatus={reviewStatus}
                result={result}
                rawChunks={rawChunks}
                error={error}
              />
            </ScrollArea>
          </div>

        </div>
      </div>
    </div>
  );
}