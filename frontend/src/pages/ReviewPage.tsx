import { useState } from "react";
import { Button }     from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar         from "../components/layout/Navbar";
import CodeEditor     from "../components/review/CodeEditor";
import ModeSelector   from "../components/review/ModeSelector";
import ReviewPanel    from "../components/review/ReviewPanel";
import { useReview }  from "../hooks/useReview";
import { X } from "lucide-react";
import scanIcon from "@/assets/icon-scan.svg";

type ReviewMode = "full" | "security" | "performance" | "clean_code" | "beginner";

const LANGUAGES = [
  "Auto detect", "JavaScript", "TypeScript", "Python", "Java", "Go",
  "Rust", "C", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "SQL",
];

export default function ReviewPage() {
  const [code, setCode]         = useState("");
  const [mode, setMode]         = useState<ReviewMode>("full");
  const [language, setLanguage] = useState("Auto detect");

  const { status: reviewStatus, result, rawChunks, error, submitStream, reset } = useReview();

  const isRunning = reviewStatus === "streaming" || reviewStatus === "loading";

  async function handleReview() {
    if (!code.trim() || isRunning) return;
    await submitStream(code, mode, language === "Auto detect" ? "" : language);
  }

  function handleReset() {
    reset();
    setCode("");
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
      <Navbar />

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="h-12 shrink-0 border-b border-gray-200 bg-white px-3 sm:px-6">
          <div className="flex h-full flex-wrap items-center gap-2">
            <ModeSelector value={mode} onChange={setMode} />

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-[26px] w-28 sm:w-36 rounded-[5px] border-gray-200 bg-gray-100 px-2 text-xs text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {reviewStatus !== "idle" && (
                <Button variant="ghost" size="icon" className="size-8 shrink-0 text-gray-400 hover:text-gray-900" onClick={handleReset}>
                  <X className="size-4" />
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleReview}
                disabled={!code.trim() || isRunning}
                className="h-[30px] gap-2 shrink-0 rounded-[10px] bg-black px-2.5 text-xs text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:bg-black/85"
              >
                <span className="flex size-4 items-center justify-center overflow-clip">
                  <img src={scanIcon} alt="" width={16} height={16} className="size-full object-contain" />
                </span>
                {isRunning ? "Reviewing…" : "Review"}
              </Button>
            </div>
          </div>
        </div>

        {/* Split panel */}
        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">

          {/* Left — code editor */}
          <div className="flex min-h-[35vh] w-full flex-col overflow-hidden border-b border-gray-200 p-4 lg:min-h-0 lg:w-1/2 lg:border-b-0 lg:border-r">
            <div className="min-h-0 flex-1 overflow-hidden">
              <CodeEditor value={code} onChange={setCode} />
            </div>
          </div>

          {/* Right — review results */}
          <div className="flex min-h-[40vh] w-full flex-col overflow-hidden lg:min-h-0 lg:w-1/2">
            {reviewStatus === "idle" ? (
              <ReviewPanel
                reviewStatus={reviewStatus}
                result={result}
                rawChunks={rawChunks}
                error={error}
              />
            ) : (
              <ScrollArea className="h-full">
                <ReviewPanel
                  reviewStatus={reviewStatus}
                  result={result}
                  rawChunks={rawChunks}
                  error={error}
                />
              </ScrollArea>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}