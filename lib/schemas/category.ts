import { z } from "zod";

export const categorySchema = z.object({
  name: z.string(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(1)
    .max(100),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
}); 