import { z } from "zod";
import { v4 as uuid } from "uuid";
import { Review } from "../models/review.model.js";
import { streamReview, generateReview } from "../services/gemini.service.js";
import { buildPrompt, VALID_MODES }     from "../utils/prompt.js";
import { ok, serverError }              from "../utils/response.js";

export const reviewSchema = z.object({
  code:     z.string().min(10, "Code must be at least 10 characters").max(50000),
  mode:     z.enum(VALID_MODES).default("full"),
  language: z.string().max(50).optional().default(""),
});

function sendSSE(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export async function stream(req, res) {
  const { code, mode, language } = req.body;
  const reviewId  = uuid();
  const startedAt = Date.now();

  res.setHeader("Content-Type",      "text/event-stream");
  res.setHeader("Cache-Control",     "no-cache");
  res.setHeader("Connection",        "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  sendSSE(res, "start", { reviewId, mode, language: language || "auto-detect" });

  let fullText = "";

  try {
    for await (const chunk of streamReview(buildPrompt(code, mode, language))) {
      fullText += chunk;
      sendSSE(res, "chunk", { chunk });
    }

    const duration = Date.now() - startedAt;
    const cleaned  = fullText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    let result;

    try {
      result = JSON.parse(cleaned);
      await Review.create({ user: req.user.id, code, mode, language, result, duration });
    } catch {
      result = null;
    }

    sendSSE(res, "done", { reviewId, fullText, duration });
  } catch (err) {
    console.error("[review/stream]", err.message);
    sendSSE(res, "error", { reviewId, message: "Failed to generate review." });
  } finally {
    res.end();
  }
}

export async function sync(req, res) {
  const { code, mode, language } = req.body;
  const startedAt = Date.now();

  try {
    const rawText = await generateReview(buildPrompt(code, mode, language));
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      return res.status(422).json({ success: false, error: { code: "PARSE_ERROR", message: "Gemini response was not valid JSON." }, rawText });
    }

    const duration = Date.now() - startedAt;
    const saved    = await Review.create({ user: req.user.id, code, mode, language, result, duration });

    return ok(res, { reviewId: saved._id, mode, duration, review: result });
  } catch (err) {
    console.error("[review/sync]", err.message);
    return serverError(res);
  }
}

export async function getHistory(req, res) {
  try {
    const page  = parseInt(req.query.page  || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip  = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user.id })
        .select("-code -result.rewritten")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ user: req.user.id }),
    ]);

    return ok(res, { reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    return serverError(res);
  }
}

export async function getReview(req, res) {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });
    if (!review) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Review not found." } });
    return ok(res, { review });
  } catch (err) {
    return serverError(res);
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!review) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Review not found." } });
    return ok(res, { message: "Review deleted." });
  } catch (err) {
    return serverError(res);
  }
}

export function getModes(req, res) {
  return ok(res, {
    modes: [
      { value: "full",        label: "Full Review",       description: "Correctness, security, performance, readability" },
      { value: "security",    label: "Security Audit",    description: "SQL injection, XSS, OWASP Top 10" },
      { value: "performance", label: "Performance",       description: "Big-O complexity, memory leaks, blocking ops" },
      { value: "clean_code",  label: "Clean Code",        description: "Naming, DRY, SOLID, readability" },
      { value: "beginner",    label: "Beginner Friendly", description: "Plain English with learning notes" },
    ],
  });
}
