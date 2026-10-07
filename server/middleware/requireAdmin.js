import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "../utils/auth.js";

const safeAdminSelect = { id: true, name: true, email: true };

export async function requireAdmin(request, _response, next) {
  const token = request.cookies?.[AUTH_COOKIE_NAME];
  if (!token) return next(new AppError("Authentication required.", 401, "UNAUTHENTICATED"));

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    return next(new AppError("Authentication required.", 401, "UNAUTHENTICATED"));
  }

  if (typeof payload.sub !== "string") {
    return next(new AppError("Authentication required.", 401, "UNAUTHENTICATED"));
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: safeAdminSelect,
    });
    if (!admin) return next(new AppError("Authentication required.", 401, "UNAUTHENTICATED"));
    request.admin = admin;
    return next();
  } catch (error) {
    return next(error);
  }
}
