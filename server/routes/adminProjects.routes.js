import { Router } from "express";
import { createAdminProject, deleteAdminProject, getAdminProject, listAdminProjects, setAdminProjectPublished, updateAdminProject } from "../controllers/adminProjects.controller.js";
import { deleteAdminProjectImage, uploadAdminProjectImages } from "../controllers/adminProjectImages.controller.js";
import { projectImageUpload } from "../middleware/projectImageUpload.js";

export const adminProjectsRouter = Router();

adminProjectsRouter.get("/", listAdminProjects);
adminProjectsRouter.get("/:id", getAdminProject);
adminProjectsRouter.post("/", createAdminProject);
adminProjectsRouter.patch("/:id", updateAdminProject);
adminProjectsRouter.patch("/:id/publish", setAdminProjectPublished);
adminProjectsRouter.post("/:id/images", projectImageUpload, uploadAdminProjectImages);
adminProjectsRouter.delete("/:projectId/images/:imageId", deleteAdminProjectImage);
adminProjectsRouter.delete("/:id", deleteAdminProject);
