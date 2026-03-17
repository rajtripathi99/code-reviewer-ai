import { z } from "zod";
import { User } from "../models/user.model.js";
import {
  setAuthCookies,
  clearAuthCookies,
  signAccessToken,
  verifyToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "../services/token.service.js";
import { env } from "../config/env.js";
import { ok, created, badRequest, unauthorized, serverError } from "../utils/response.js";

export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores"),
  email:    z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return badRequest(res, exists.email === email ? "Email already in use." : "Username already taken.");
    }

    const user = await User.create({ username, email, password });
    setAuthCookies(res, user);

    return created(res, { user: user.toSafeObject() });
  } catch (err) {
    console.error("[auth/register]", err);
    return serverError(res);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return unauthorized(res, "Invalid email or password.");

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) return unauthorized(res, "Invalid email or password.");

    setAuthCookies(res, user);

    return ok(res, { user: user.toSafeObject() });
  } catch (err) {
    console.error("[auth/login]", err);
    return serverError(res);
  }
}

export function logout(req, res) {
  clearAuthCookies(res);
  return ok(res, { message: "Logged out." });
}

export async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return unauthorized(res, "No refresh token. Please log in.");

  try {
    const decoded = verifyToken(token);
    const user    = await User.findById(decoded.id);
    if (!user) {
      clearAuthCookies(res);
      return unauthorized(res, "User not found.");
    }

    const newToken = signAccessToken({ id: user._id, username: user.username, role: user.role });

    res.cookie(ACCESS_COOKIE, newToken, {
      httpOnly: true,
      secure:   env.COOKIE_SECURE,
      sameSite: "lax",
      path:     "/",
      maxAge:   15 * 60 * 1000,
    });

    return ok(res, { message: "Token refreshed." });
  } catch {
    clearAuthCookies(res);
    return unauthorized(res, "Refresh token expired. Please log in again.");
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return unauthorized(res, "User not found.");
    return ok(res, { user: user.toSafeObject() });
  } catch (err) {
    return serverError(res);
  }
}
