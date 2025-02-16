import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  size: z.union([z.literal("small"), z.literal("scale")]),
});

export const updateProjectSchema = createProjectSchema.extend({
  id: z.string(),
});

export const projectIdSchema = z.object({
  id: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>; 