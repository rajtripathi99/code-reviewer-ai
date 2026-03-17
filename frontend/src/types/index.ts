export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export type ReviewMode    = "full" | "security" | "performance" | "clean_code" | "beginner";
export type ReviewStatus  = "idle" | "loading" | "streaming" | "done" | "error";
export type IssueSeverity = "critical" | "warning" | "info" | "suggestion";
export type MetricLevel   = "low" | "medium" | "high";

export interface ReviewIssue {
  id:          string;
  severity:    IssueSeverity;
  title:       string;
  description: string;
  line:        number | null;
  fix:         string;
}

export interface ReviewMetrics {
  complexity:      MetricLevel;
  maintainability: MetricLevel;
  testability:     MetricLevel;
  performance:     MetricLevel;
}

export interface ReviewResult {
  language:      string;
  summary:       string;
  score:         number;
  issues:        ReviewIssue[];
  metrics:       ReviewMetrics;
  rewritten:     string;
  rewrite_notes: string[];
}

export interface Review {
  _id:       string;
  user:      string;
  code:      string;
  mode:      ReviewMode;
  language:  string;
  result:    ReviewResult;
  duration:  number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page:  number;
  limit: number;
  total: number;
  pages: number;
}