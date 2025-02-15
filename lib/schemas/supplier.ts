import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(1)
    .max(100),
  description: z.string().optional().nullable(),
}); 