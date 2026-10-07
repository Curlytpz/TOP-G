import { Router } from "express";
import { getProject, listProjects } from "../controllers/projects.controller.js";

const router = Router();

router.get("/", listProjects);
router.get("/:id", getProject);

export default router;
