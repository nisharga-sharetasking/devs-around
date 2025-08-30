import { z } from "zod";

export const createSubCategorySchema = z.object({
  name_en: z.string().min(1, { message: "English name is required." }),
  description_en: z.string().optional(),
   position: z.coerce
    .number()
    .int()
    .min(0, { message: "Position must be a non-negative integer." })
    .default(1),
  slug: z.string().min(1, { message: "Slug is required." }),
  category: z.string().min(1, { message: "Category ID is required." }),
});

export const updateSubCategorySchema = z.object({
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
  category: z.string().optional(),
});
