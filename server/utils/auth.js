import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const AUTH_COOKIE_NAME = "topg_admin_session";

function getJwtSecret() {
  if (!config.jwtSecret) throw new Error("JWT_SECRET is not configured.");
  return config.jwtSecret;
}

export function createAuthToken(admin) {
  return jwt.sign({ sub: admin.id }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "8h",
    issuer: "topg-auto-seat-api",
    audience: "topg-admin",
  });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: ["HS256"],
    issuer: "topg-auto-seat-api",
    audience: "topg-admin",
  });
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  };
}

export function authCookieClearOptions() {
  const { maxAge: _maxAge, ...options } = authCookieOptions();
  return options;
}
