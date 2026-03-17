import { useState, useRef } from "react";
import api from "../lib/api";
import type { ReviewResult } from "../components/review/ReviewPanel";

type ReviewMode   = "full" | "security" | "performance" | "clean_code" | "beginner";
type ReviewStatus = "idle" | "loading" | "streaming" | "done" | "error";

interface UseReviewReturn {
  status:       ReviewStatus;
  result:       ReviewResult | null;
  rawChunks:    string;
  error:        string | null;
  submitStream: (code: string, mode: ReviewMode, language: string) => Promise<void>;
  submitSync:   (code: string, mode: ReviewMode, language: string) => Promise<void>;
  reset:        () => void;
}

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function cleanAndParse(raw: string): ReviewResult | null {
  let text = raw.trim();

  // Strip all possible markdown fence variants: ```json, ```rust, ```, etc.
  text = text.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();

  // Find the outermost JSON object boundaries
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  text = text.slice(start, end + 1);

  try {
    return JSON.parse(text) as ReviewResult;
  } catch (e) {
    // Log to console so you can inspect what Gemini actually returned
    console.error("[useReview] JSON parse failed:", e);
    console.log("[useReview] Raw text that failed:", text.slice(0, 500));
    return null;
  }
}

export function useReview(): UseReviewReturn {
  const [status, setStatus]       = useState<ReviewStatus>("idle");
  const [result, setResult]       = useState<ReviewResult | null>(null);
  const [rawChunks, setRawChunks] = useState("");
  const [error, setError]         = useState<string | null>(null);
  const abortRef                  = useRef<AbortController | null>(null);

  async function readStream(response: Response, code: string, mode: ReviewMode, language: string) {
    const reader  = response.body!.getReader();
    const decoder = new TextDecoder();
    let   buffer  = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: error")) {
          setError("Review generation failed.");
          setStatus("error");
          return;
        }

        if (!line.startsWith("data:")) continue;

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }

        if (typeof parsed.chunk === "string") {
          setRawChunks((p) => p + (parsed.chunk as string));
        }

        if (typeof parsed.fullText === "string") {
          const extracted = cleanAndParse(parsed.fullText);
          if (extracted) {
            setResult(extracted);
            setStatus("done");
          } else {
            setError("Streaming parse failed. Retrying with sync…");
            try {
              const r = await api.post("/api/review/sync", { code, mode, language });
              setResult(r.data.data.review as ReviewResult);
              setStatus("done");
              setError(null);
            } catch {
              setError("Could not parse the review response. Please try again.");
              setStatus("error");
            }
          }
        }
      }
    }
  }

  async function submitStream(code: string, mode: ReviewMode, language: string) {
    setStatus("streaming");
    setResult(null);
    setRawChunks("");
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let res = await fetch(`${BASE}/api/review/stream`, {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        signal:      controller.signal,
        body:        JSON.stringify({ code, mode, language }),
      });

      // If 401, try refreshing the token and retry once
      if (res.status === 401) {
        try {
          await fetch(`${BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          });
        } catch {
          setError("Session expired. Please log in again.");
          setStatus("error");
          return;
        }

        res = await fetch(`${BASE}/api/review/stream`, {
          method:      "POST",
          headers:     { "Content-Type": "application/json" },
          credentials: "include",
          signal:      controller.signal,
          body:        JSON.stringify({ code, mode, language }),
        });
      }

      if (!res.ok) {
        setError(`Server error: ${res.status}`);
        setStatus("error");
        return;
      }

      await readStream(res, code, mode, language);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Connection failed. Please try again.");
        setStatus("error");
      }
    }
  }

  async function submitSync(code: string, mode: ReviewMode, language: string) {
    setStatus("loading");
    setResult(null);
    setError(null);
    try {
      const r = await api.post("/api/review/sync", { code, mode, language });
      setResult(r.data.data.review as ReviewResult);
      setStatus("done");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? "Review failed.";
      setError(msg);
      setStatus("error");
    }
  }

  function reset() {
    abortRef.current?.abort();
    setStatus("idle");
    setResult(null);
    setRawChunks("");
    setError(null);
  }

  return { status, result, rawChunks, error, submitStream, submitSync, reset };
}