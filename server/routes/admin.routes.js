import { Router } from "express";
import { deleteQuote, getQuote, listQuotes, updateQuoteStatus } from "../controllers/adminQuotes.controller.js";
import { adminProjectsRouter } from "./adminProjects.routes.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const adminRouter = Router();

adminRouter.use(requireAdmin);
adminRouter.get("/quotes", listQuotes);
adminRouter.get("/quotes/:id", getQuote);
adminRouter.patch("/quotes/:id/status", updateQuoteStatus);
adminRouter.delete("/quotes/:id", deleteQuote);
adminRouter.use("/projects", adminProjectsRouter);
