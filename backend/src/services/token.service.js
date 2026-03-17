import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const ACCESS_COOKIE  = "access_token";
export const REFRESH_COOKIE = "refresh_token";

const cookieBase = {
  httpOnly: true,
  secure:   env.COOKIE_SECURE,
  sameSite: env.IS_PROD ? "none" : "lax",
  path:     "/",
};

export const signAccessToken  = (payload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
export const signRefreshToken = (payload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
export const verifyToken      = (token)   => jwt.verify(token, env.JWT_SECRET);

export function setAuthCookies(res, user) {
  const payload = { id: user._id, username: user.username, role: user.role };

  res.cookie(ACCESS_COOKIE, signAccessToken(payload), {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie(REFRESH_COOKIE, signRefreshToken({ id: user._id }), {
    ...cookieBase,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path:   env.IS_PROD ? "/" : "/api/auth/refresh",
  });
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE,  { ...cookieBase });
  res.clearCookie(REFRESH_COOKIE, { ...cookieBase, path: env.IS_PROD ? "/" : "/api/auth/refresh" });
}