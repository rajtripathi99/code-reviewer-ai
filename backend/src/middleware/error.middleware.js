import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: `${req.method} ${req.path} not found` },
  });
}

export function errorHandler(err, req, res, _next) {
  console.error("[error]", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code:    "SERVER_ERROR",
      message: env.IS_PROD ? "Something went wrong." : err.message,
    },
  });
}
