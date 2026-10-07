import { config } from "../config/env.js";

export function errorHandler(error, request, response, _next) {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return response.status(422).json({ error: "VALIDATION_ERROR", message: "Each image must be 8 MB or smaller." });
  }
  if (error?.code === "LIMIT_FILE_COUNT" || error?.code === "LIMIT_UNEXPECTED_FILE") {
    return response.status(422).json({ error: "VALIDATION_ERROR", message: "You can upload up to 6 images at a time." });
  }
  if (error?.code === "UPLOAD_UNAVAILABLE") {
    return response.status(503).json({ error: "UPLOAD_UNAVAILABLE", message: "Cloudinary is not configured." });
  }
  if (error?.code === "UPLOAD_FAILED") {
    return response.status(502).json({ error: "UPLOAD_FAILED", message: "We couldn't upload the image to storage. Please try again." });
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isServerError = statusCode >= 500;
  if (isServerError) {
    console.error("[api] request failed", {
      code: error?.code || "INTERNAL_SERVER_ERROR",
      method: request.method,
      name: error?.name || "Error",
      path: request.path,
      statusCode,
    });
  }

  const payload = {
    error: isServerError ? "INTERNAL_SERVER_ERROR" : error.code || "REQUEST_ERROR",
    message: isServerError ? "An unexpected error occurred." : error.message,
  };

  if (!isServerError && error.details) payload.details = error.details;
  if (config.nodeEnv !== "production" && isServerError) payload.requestId = response.locals.requestId;

  response.status(statusCode).json(payload);
}