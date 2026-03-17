import express      from "express";
import cors         from "cors";
import cookieParser from "cookie-parser";

import { env }                    from "./src/config/env.js";
import { connectDB }              from "./src/config/db.js";
import apiRoutes                  from "./src/routes/index.js";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";

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

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running → http://localhost:${env.PORT}`);
  });
});