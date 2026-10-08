import { config } from "../config/env.js";

// Enable only for local/development troubleshooting. It deliberately excludes
// cookies, tokens, request bodies, passwords, and provider details.
export function requestDiagnostics(request, response, next) {
  if (config.nodeEnv !== "development") return next();

  response.on("finish", () => {
    if (!request.path.startsWith("/api")) return;

    console.info("[api] request", {
      method: request.method,
      path: request.path,
      status: response.statusCode,
      authenticated: Boolean(request.admin),
    });
  });

  return next();
}