import { Router } from "express";
import { createQuote } from "../controllers/quotes.controller.js";
import { quoteLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/", quoteLimiter, createQuote);

export default router;
