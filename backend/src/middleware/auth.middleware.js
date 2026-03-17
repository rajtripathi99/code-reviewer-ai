import { verifyToken, ACCESS_COOKIE } from "../services/token.service.js";
import { unauthorized } from "../utils/response.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return unauthorized(res, "No access token. Please log in.");

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError"
      ? "Session expired. Please refresh or log in again."
      : "Invalid token. Please log in again.";
    return unauthorized(res, msg);
  }
}
