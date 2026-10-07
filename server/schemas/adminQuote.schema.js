import { z } from "zod";

export const quoteIdSchema = z.object({
  id: z.string().cuid(),
}).strict();

export const quoteStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
}).strict();
