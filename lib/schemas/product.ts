import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  description: z.array(
    z.object({
      type: z.string(),
      children: z.array(z.object({ text: z.string() })),
    })
  ),
  quantity: z.number().optional(),
  price: z.number().optional(),
  currency: z.enum(["LYD", "USD"]),
  supplierId: z.string(),
  categoryIds: z.array(z.string()),
  mediaFiles: z.array(z.string()).optional(),
}); 