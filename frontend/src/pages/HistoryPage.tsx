import { useState, useEffect } from "react";
import { Link }     from "react-router-dom";
import api          from "../lib/api";
import Navbar       from "../components/layout/Navbar";
import { Button }   from "@/components/ui/button";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Trash2, ChevronLeft, ChevronRight, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  _id:       string;
  mode:      string;
  language:  string;
  duration:  number;
  createdAt: string;
  result: {
    score:    number;
    language: string;
    summary: string;
  };
}

interface Pagination {
  page:  number;
  limit: number;
  total: number;
  pages: number;
}

const MODE_LABELS: Record<string, string> = {
  full:        "Full",
  security:    "Security",
  performance: "Performance",
  clean_code:  "Clean Code",
  beginner:    "Beginner",
};

function scoreColor(score: number) {
  if (score >= 75) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  if (score >= 25) return "text-orange-500";
  return "text-red-500";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function HistoryPage() {
  const [reviews, setReviews]         = useState<Review[]>([]);
  const [pagination, setPagination]   = useState<Pagination | null>(null);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [deleting, setDeleting]       = useState<string | null>(null);

  async function fetchHistory(p: number) {
    setLoading(true);
    try {
      const r = await api.get(`/api/review?page=${p}&limit=10`);
      setReviews(r.data.data.reviews);
      setPagination(r.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { fetchHistory(page); }, [page]);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await api.delete(`/api/review/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {}
    finally { setDeleting(null); }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Review History</h1>
            {pagination && (
              <p className="text-sm text-muted-foreground">
                {pagination.total} review{pagination.total !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/review">New Review</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
              <History className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No reviews yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your review history will appear here.</p>
            </div>
            <Button asChild size="sm"><Link to="/review">Start reviewing</Link></Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 hover:bg-accent/30 transition-colors"
                >
                  <div className={cn("w-8 text-center text-lg font-bold tabular-nums", scoreColor(review.result?.score ?? 0))}>
                    {review.result?.score ?? "—"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-medium">
                        {MODE_LABELS[review.mode] ?? review.mode}
                      </Badge>
                      {(review.language || review.result?.language) && (
                        <span className="text-xs text-muted-foreground">{review.language || review.result?.language}</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {review.result?.summary ?? "No summary"}
                    </p>
                  </div>

                  <p className="shrink-0 text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button asChild size="icon" variant="ghost" className="size-8">
                      <Link to={`/history/${review._id}`}><Eye className="size-3.5" /></Link>
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(review._id)}
                      disabled={deleting === review._id}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button size="icon" variant="outline" className="size-8" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm text-muted-foreground">{page} / {pagination.pages}</span>
                <Button size="icon" variant="outline" className="size-8" onClick={() => setPage((p) => p + 1)} disabled={page === pagination.pages}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}