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
   password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[\W_]/.test(val), {
      message: "Password must contain at least one special character",
    }),
   
});
