import { z } from "zod";

const title = z.string().min(1, "Title is required.");
const description = z.string().optional();
const completed = z.boolean().default(false);

export const taskSchema = z.object({
  title,
  description,
  completed,
});
