import "dotenv/config";

function get(key, fallback) {
  const val = process.env[key] || fallback;
  if (!val) throw new Error(`Missing env variable: ${key}`);
  return val;
}

export const env = {
  PORT:                   parseInt(get("PORT", "5000")),
  NODE_ENV:               get("NODE_ENV", "development"),
  IS_PROD:                get("NODE_ENV", "development") === "production",

  MONGO_URI:              get("MONGO_URI"),

  JWT_SECRET:             get("JWT_SECRET"),
  JWT_EXPIRES_IN:         get("JWT_EXPIRES_IN", "15m"),
  JWT_REFRESH_EXPIRES_IN: get("JWT_REFRESH_EXPIRES_IN", "7d"),

  COOKIE_SECRET:          get("COOKIE_SECRET"),
  COOKIE_SECURE:          get("COOKIE_SECURE", "false") === "true",

  GEMINI_API_KEY:         get("GEMINI_API_KEY"),
  GEMINI_MODEL:           get("GEMINI_MODEL", "gemini-2.0-flash"),

  CLIENT_URL:             get("CLIENT_URL", "http://localhost:5173"),
};
