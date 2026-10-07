import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { loginLimiter } from "../middleware/rateLimiters.js";

export const authRouter = Router();

authRouter.post("/login", loginLimiter, login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAdmin, me);
