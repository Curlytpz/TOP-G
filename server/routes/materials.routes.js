import { Router } from "express";
import { listMaterials } from "../controllers/materials.controller.js";

const router = Router();

router.get("/", listMaterials);

export default router;
