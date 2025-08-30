import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z.string().min(8, "Password should be at least 8 characters"),
  phone_number: z
    .string()
    .min(11, "Phone number should be 11 digits")
    .max(11, "Phone number should be 11 digits"),
  whatsapp_number: z
    .string()
    .min(11, "WhatsApp number should be 11 digits")
    .max(11, "WhatsApp number should be 11 digits"),
  business_category: z.string().min(1, {
    message: "Business category is required",
  }),
});
