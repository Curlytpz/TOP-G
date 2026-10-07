import { config } from "../config/env.js";
import { AppError } from "../utils/appError.js";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const verificationFailure = () => new AppError("Please complete the security verification and try again.", 422, "TURNSTILE_FAILED");

export async function verifyTurnstileToken(token) {
  if (typeof token !== "string" || token.trim().length === 0) throw verificationFailure();
  if (!config.turnstileSecretKey) {
    console.error("[turnstile] verification is unavailable because TURNSTILE_SECRET_KEY is not configured.");
    throw new AppError("Quote verification is temporarily unavailable. Please try again later.", 503, "TURNSTILE_UNAVAILABLE");
  }

  try {
    const body = new URLSearchParams({ secret: config.turnstileSecretKey, response: token.trim() });
    const providerResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!providerResponse.ok) throw new Error("Turnstile verification service returned an error.");

    const result = await providerResponse.json().catch(() => null);
    if (!result?.success) throw verificationFailure();
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("[turnstile] provider verification request failed.");
    throw new AppError("Quote verification is temporarily unavailable. Please try again later.", 503, "TURNSTILE_UNAVAILABLE");
  }
}