import { z } from "zod";

export const LoginSchema = z.object({ 
  email: z
    .string()
    .email("Invalid email address"),
    
  password: z
    .string()
    .min(8, "Password should be at least 8 characters"),
});
