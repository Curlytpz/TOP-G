import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { requestDiagnostics } from "./middleware/requestDiagnostics.js";
import { apiLimiter } from "./middleware/rateLimiters.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import healthRouter from "./routes/health.routes.js";
import materialsRouter from "./routes/materials.routes.js";
import projectsRouter from "./routes/projects.routes.js";
import quotesRouter from "./routes/quotes.routes.js";
import servicesRouter from "./routes/services.routes.js";
import testimonialsRouter from "./routes/testimonials.routes.js";

function isAllowedOrigin(origin) {
  if (!origin || origin === config.clientOrigin) return true;
  if (config.nodeEnv === "production") return false;

  const localOrigins = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);
  return localOrigins.has(origin) && localOrigins.has(config.clientOrigin);
}

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS policy."), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());
app.use(requestDiagnostics);

app.use("/api", apiLimiter);
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/services", servicesRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/quotes", quotesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/testimonials", testimonialsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
