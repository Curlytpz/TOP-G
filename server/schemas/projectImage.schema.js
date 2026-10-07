import { z } from "zod";

export const projectImageParamsSchema = z.object({
  id: z.string().cuid(),
}).strict();

export const deleteProjectImageParamsSchema = z.object({
  projectId: z.string().cuid(),
  imageId: z.string().cuid(),
}).strict();

export const projectImageUploadSchema = z.object({
  imageType: z.enum(["BEFORE", "AFTER", "GALLERY"]),
}).strict();