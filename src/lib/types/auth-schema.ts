import { z } from "zod";

const email = z.string().email("Invalid email address.").trim().toLowerCase();
const password = z
  .string()
  .min(8, "8 characters.")
  .regex(/\d/, "a number.")
  .regex(/[A-Z]/, "an uppercase letter.")
  .regex(/[a-z]/, "a lowercase letter.")
  .regex(/[@$!%*?&#]/, "a special character.")
  .max(64, "Up to 64 characters.");
const role = z.enum(["ADMIN", "USER"]).default("USER");

export const signupSchema = z.object({ email, password, role });

export const signinSchema = z.object({ email, password });
