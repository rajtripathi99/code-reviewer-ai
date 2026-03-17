const BASE = `You are an expert code reviewer. Analyze the given code and respond with ONLY a JSON object — no markdown, no extra text.

Return this exact shape:
{
  "language": "detected language",
  "summary": "1-2 sentence overall assessment",
  "score": <number 0-100>,
  "issues": [
    {
      "id": "ISSUE-001",
      "severity": "critical" | "warning" | "info" | "suggestion",
      "title": "Short title",
      "description": "Detailed explanation",
      "line": <line number or null>,
      "fix": "How to fix it"
    }
  ],
  "metrics": {
    "complexity":      "low" | "medium" | "high",
    "maintainability": "low" | "medium" | "high",
    "testability":     "low" | "medium" | "high",
    "performance":     "low" | "medium" | "high"
  },
  "rewritten": "The improved version of the code as a plain string",
  "rewrite_notes": ["What changed and why"]
}`;

const MODES = {
  full:        "Do a complete review: correctness, security, performance, readability, and maintainability.",
  security:    "Focus only on security vulnerabilities: SQL injection, XSS, CSRF, exposed secrets, insecure auth, OWASP Top 10.",
  performance: "Focus only on performance: time/space complexity, memory leaks, blocking operations. Include Big-O estimates.",
  clean_code:  "Focus only on clean code: naming, function length, DRY, SOLID, magic numbers, readability.",
  beginner:    "Write a beginner-friendly review. Use simple language, explain WHY each issue matters, and add helpful comments in the rewritten code.",
};

export const VALID_MODES = Object.keys(MODES);

export function buildPrompt(code, mode = "full", language = "") {
  const langHint = language ? `Language: ${language}\n` : "";
  return `${BASE}\n\nReview Mode: ${mode.toUpperCase()}\n${MODES[mode] || MODES.full}\n${langHint}\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nReturn the JSON object only.`;
}
