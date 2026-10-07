import { z } from "zod";

const currentYear = new Date().getFullYear();
const emptyStringToUndefined = (value) => typeof value === "string" && value.trim() === "" ? undefined : value;
const optionalString = (maxLength) => z.preprocess(
  emptyStringToUndefined,
  z.string().trim().max(maxLength).optional(),
);

export const quoteCreateSchema = z.object({
  turnstileToken: z.string().trim().min(1).max(2048),
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(24).regex(/^\+?[0-9\s().-]+$/, "Enter a valid phone number."),
  email: z.preprocess(emptyStringToUndefined, z.string().trim().email().max(254).optional()),
  carModel: z.string().trim().min(2).max(120),
  yearModel: z.coerce.number().int().min(1886).max(currentYear + 1),
  serviceIds: z.array(z.string().trim().cuid()).min(1, "Choose at least one service.").max(4).refine((ids) => new Set(ids).size === ids.length, "Services must be unique."),
  materialId: z.preprocess(emptyStringToUndefined, z.string().trim().cuid().optional()),
  installationType: z.enum(["SHOP", "HOME_SERVICE", "UNSURE"]).optional(),
  preferredDate: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).transform((value) => new Date(`${value}T00:00:00.000Z`)).optional(),
  ),
  notes: optionalString(2000),
}).strict();