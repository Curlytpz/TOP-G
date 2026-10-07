import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import {
  authCookieClearOptions,
  authCookieOptions,
  createAuthToken,
} from "../utils/auth.js";
import { loginSchema } from "../schemas/auth.schema.js";

const adminSelect = { id: true, name: true, email: true };

function invalidCredentials() {
  return new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
}

export async function login(request, response, next) {
  try {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) throw invalidCredentials();

    const admin = await prisma.admin.findUnique({
      where: { email: parsed.data.email },
      select: { ...adminSelect, passwordHash: true },
    });

    if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) {
      throw invalidCredentials();
    }

    response.cookie("topg_admin_session", createAuthToken(admin), authCookieOptions());

    return response.status(200).json({
      data: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    return next(error);
  }
}

export function logout(_request, response) {
  response.clearCookie("topg_admin_session", authCookieClearOptions());
  return response.status(200).json({ ok: true });
}

export function me(request, response) {
  return response.status(200).json({ data: request.admin });
}
