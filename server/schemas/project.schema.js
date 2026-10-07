import { z } from "zod";

const currentYear = new Date().getFullYear() + 1;
const optionalText = (max) => z.string().trim().max(max).nullable().optional().transform((value) => {
  if (value === undefined || value === null) return value;
  return value || null;
});
const optionalYear = z.number().int().min(1900).max(currentYear).nullable().optional();
const optionalMaterialId = z.string().cuid().nullable().optional();

export const projectIdSchema = z.object({ id: z.string().cuid() }).strict();

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  carModel: optionalText(120),
  yearModel: optionalYear,
  materialId: optionalMaterialId,
  description: optionalText(2000),
  published: z.boolean().optional(),
}).strict();

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  carModel: optionalText(120),
  yearModel: optionalYear,
  materialId: optionalMaterialId,
  description: optionalText(2000),
  published: z.boolean().optional(),
}).strict();

export const publishProjectSchema = z.object({ published: z.boolean() }).strict();
