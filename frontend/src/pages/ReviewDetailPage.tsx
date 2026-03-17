import { useEffect, useState } from "react";
import { useParams, Link }    from "react-router-dom";
import api           from "../lib/api";
import Navbar        from "../components/layout/Navbar";
import ReviewPanel   from "../components/review/ReviewPanel";
import type { ReviewResult } from "../components/review/ReviewPanel";
import { Button }    from "@/components/ui/button";
import { Skeleton }  from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft }  from "lucide-react";

interface Review {
  _id:       string;
  code:      string;
  mode:      string;
  language:  string;
  createdAt: string;
  result:    ReviewResult;
}

export default function ReviewDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const [review, setReview]   = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/api/review/${id}`)
      .then((r) => setReview(r.data.data.review))
      .catch(() => setError("Review not found."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Button asChild size="icon" variant="ghost" className="size-8 shrink-0">
              <Link to="/history"><ArrowLeft className="size-4" /></Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">Review Detail</h1>
              {review && (
                <p className="text-xs text-muted-foreground truncate">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  {review.language ? ` · ${review.language}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/history">Back to history</Link>
            </Button>
          </div>
        ) : review ? (
          <>
            {review.code && (
              <div className="mb-4 rounded-xl border bg-muted/30 overflow-hidden">
                <div className="border-b px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground">Original Code</span>
                </div>
                <ScrollArea className="max-h-56">
                  <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono text-foreground">
                    <code>{review.code}</code>
                  </pre>
                </ScrollArea>
              </div>
            )}
            <div className="rounded-xl border bg-card overflow-hidden">
              <ReviewPanel reviewStatus="done" result={review.result} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}