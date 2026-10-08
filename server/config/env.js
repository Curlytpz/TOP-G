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

const nodeEnv = (process.env.NODE_ENV || "development").toLowerCase();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173";

export const config = Object.freeze({
  nodeEnv,
  port: parsePort(process.env.PORT),
  clientOrigin,
  // A configured HTTPS frontend means browser auth crosses origins. Do not fall
  // back to a development cookie if a host omits NODE_ENV in production.
  usesCrossSiteAuthCookie: nodeEnv === "production" || isHttpsOrigin(clientOrigin),
  jwtSecret: process.env.JWT_SECRET || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || "",
});

export function validateProductionConfig() {
  if (config.nodeEnv !== "production") return;

  const missing = [
    ["DATABASE_URL", process.env.DATABASE_URL],
    ["CLIENT_ORIGIN", process.env.CLIENT_ORIGIN],
    ["JWT_SECRET", config.jwtSecret],
    ["TURNSTILE_SECRET_KEY", config.turnstileSecretKey],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(", ")}.`);
  if (!isHttpsOrigin(config.clientOrigin)) throw new Error("CLIENT_ORIGIN must be a single HTTPS origin without a path.");
}