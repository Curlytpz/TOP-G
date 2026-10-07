import { Router } from "express";
import { listTestimonials } from "../controllers/testimonials.controller.js";

const router = Router();

router.get("/", listTestimonials);

export default router;
