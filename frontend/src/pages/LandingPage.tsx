import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Code2, Sparkles, ShieldCheck, Zap, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Review",
    description: "Gemini analyses your code in real time, streaming results as they generate.",
  },
  {
    icon: ShieldCheck,
    title: "Security Audit",
    description: "Catch SQL injection, XSS, exposed secrets, and OWASP Top 10 vulnerabilities.",
  },
  {
    icon: Zap,
    title: "Performance Analysis",
    description: "Identify O(n²) bottlenecks, memory leaks, and inefficient patterns with Big-O estimates.",
  },
  {
    icon: BookOpen,
    title: "5 Review Modes",
    description: "Full review, security, performance, clean code, or beginner-friendly explanations.",
  },
];

const MODES = [
  { label: "Full Review",    color: "bg-primary/10 text-primary"              },
  { label: "Security",       color: "bg-red-500/10 text-red-500"              },
  { label: "Performance",    color: "bg-orange-500/10 text-orange-500"        },
  { label: "Clean Code",     color: "bg-violet-500/10 text-violet-500"        },
  { label: "Beginner",       color: "bg-green-500/10 text-green-500"          },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <Code2 className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm">CodeReview<span className="text-primary">AI</span></span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm">
                <Link to="/review">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:pt-20 pb-12 sm:pb-16 sm:px-6 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            Powered by Gemini AI
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Code reviews that actually
          <br />
          <span className="text-primary">teach you something</span>
        </h1>

        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Paste any code snippet and get a structured AI review — bugs, severity levels,
          performance issues, and a fully rewritten version. Streamed live.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link to="/register">
              Start reviewing for free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>

        {/* Mode pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {MODES.map((m) => (
            <span key={m.label} className={cn("rounded-full px-3 py-1 text-xs font-medium", m.color)}>
              {m.label}
            </span>
          ))}
        </div>
      </section>

      {/* Fake UI preview */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
          {/* Fake toolbar */}
          <div className="flex items-center gap-2 border-b bg-muted/30 px-3 sm:px-4 py-2.5 sm:py-3 overflow-x-auto">
            <div className="flex gap-1.5 shrink-0">
              <div className="size-2.5 sm:size-3 rounded-full bg-red-400/60" />
              <div className="size-2.5 sm:size-3 rounded-full bg-yellow-400/60" />
              <div className="size-2.5 sm:size-3 rounded-full bg-green-400/60" />
            </div>
            <div className="hidden sm:flex gap-1 ml-2">
              {MODES.map((m) => (
                <span key={m.label} className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap",
                  m.label === "Security" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <div className="hidden sm:block h-6 w-24 rounded-md bg-muted" />
              <div className="h-6 w-16 rounded-md bg-primary/80" />
            </div>
          </div>

          {/* Fake split panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[280px]">
            {/* Left — fake code */}
            <div className="border-b md:border-b-0 md:border-r p-4 font-mono text-xs text-muted-foreground leading-6 overflow-x-auto">
              <div className="flex gap-4">
                <div className="flex flex-col items-end text-muted-foreground/40 select-none w-4">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
                </div>
                <div>
                  <div><span className="text-blue-400">fn </span><span className="text-yellow-400">get_user</span><span>(id: </span><span className="text-green-400">String</span><span>) {'{'}</span></div>
                  <div className="pl-4"><span className="text-blue-400">let </span><span>query = </span><span className="text-orange-400">"SELECT * FROM users"</span></div>
                  <div className="pl-8"><span className="text-orange-400">  + " WHERE id = " </span><span>+ id;</span></div>
                  <div className="pl-4"><span className="text-muted-foreground/60">// TODO: fix this</span></div>
                  <div className="pl-4"><span>db.query(query)</span></div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>

            {/* Right — fake results */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex items-start gap-3 rounded-xl border bg-background p-3">
                <div className="relative flex items-center justify-center">
                  <svg width="52" height="52" className="-rotate-90">
                    <circle cx="26" cy="26" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30"/>
                    <circle cx="26" cy="26" r="20" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray="125.6" strokeDashoffset="100" />
                  </svg>
                  <span className="absolute text-sm font-bold text-red-500">20</span>
                </div>
                <div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Rust</span>
                    <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500">2 critical</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">SQL injection vulnerability detected via string concatenation. Use parameterized queries.</p>
                </div>
              </div>

              <div className="rounded-lg border p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-500">Critical</span>
                  <span className="text-xs font-medium">SQL Injection via string concat</span>
                </div>
                <p className="mt-1 pl-1 text-[11px] text-muted-foreground">Line 2 — never interpolate user input directly into queries</p>
              </div>

              <div className="rounded-lg border p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-yellow-500/20 bg-yellow-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-yellow-500">Warning</span>
                  <span className="text-xs font-medium">Missing error handling on db.query</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border bg-card p-5 space-y-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Ready to write better code?</h2>
          <p className="mt-3 text-muted-foreground">Free to use. No credit card required.</p>
          <Button asChild size="lg" className="mt-6 gap-2">
            <Link to="/register">
              Create your free account
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded bg-primary">
              <Code2 className="size-3 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">CodeReviewAI</span>
          </div>
          <p className="text-xs text-muted-foreground">Built by Raj</p>
        </div>
      </footer>

    </div>
  );
}