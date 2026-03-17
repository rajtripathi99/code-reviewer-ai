import express      from "express";
import cors         from "cors";
import cookieParser from "cookie-parser";
import path         from "path";
import { fileURLToPath } from "url";

import { env }                    from "./src/config/env.js";
import { connectDB }              from "./src/config/db.js";
import apiRoutes                  from "./src/routes/index.js";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin:         env.IS_PROD ? env.CLIENT_URL : true,
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(env.COOKIE_SECRET));

app.get("/health", (req, res) => {
  res.json({ success: true, data: { status: "ok", uptime: process.uptime() } });
});

app.use("/api", apiRoutes);

// --- SPA fallback: serve built frontend for any non-API route ---
const clientDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  // Only serve index.html for non-API, navigational GET requests
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();  // if dist doesn't exist yet, fall through to notFound
  });
});

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running → http://localhost:${env.PORT}`);
  });
});