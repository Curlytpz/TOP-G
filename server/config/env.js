import "dotenv/config";

function parsePort(value) {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : 3001;
}

function isHttpsOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.pathname === "/" && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parsePort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173",
  jwtSecret: process.env.JWT_SECRET || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  quoteNotificationEmail: process.env.QUOTE_NOTIFICATION_EMAIL || "",
  emailFrom: process.env.EMAIL_FROM || "",
  appUrl: process.env.APP_URL || "http://localhost:5173",
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || "",
});

export function validateProductionConfig() {
  if (config.nodeEnv !== "production") return;

  const missing = [
    ["DATABASE_URL", process.env.DATABASE_URL],
    ["CLIENT_ORIGIN", process.env.CLIENT_ORIGIN],
    ["APP_URL", process.env.APP_URL],
    ["JWT_SECRET", config.jwtSecret],
    ["TURNSTILE_SECRET_KEY", config.turnstileSecretKey],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(", ")}.`);
  if (!isHttpsOrigin(config.clientOrigin)) throw new Error("CLIENT_ORIGIN must be a single HTTPS origin without a path.");
  if (!isHttpsOrigin(config.appUrl)) throw new Error("APP_URL must be a single HTTPS origin without a path.");
}