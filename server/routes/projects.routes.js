import { Router } from "express";
import { listProjects } from "../controllers/projects.controller.js";

const router = Router();

router.get("/", listProjects);

export default router;
