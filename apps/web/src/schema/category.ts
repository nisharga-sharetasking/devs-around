import { z } from "zod";

export const createCategorySchema = z.object({
  name_en: z.string().min(1, { message: "English name is required." }), 
  description_en: z.string().optional(), 
  position: z.coerce
    .number()
    .int()
    .min(0, { message: "Position must be a non-negative integer." })
    .default(1),
});

export const updateCategorySchema = z.object({
  name_en: z
    .string()
    .min(1, { message: "English name is required." })
    .optional(),
  name_bn: z
    .string()
    .min(1, { message: "Bengali name is required." })
    .optional(),
  description_en: z.string().optional(),
  description_bn: z.string().optional(),
  position: z.coerce
    .number()
    .int()
    .min(0, { message: "Position must be a non-negative integer." })
    .optional(),
});
