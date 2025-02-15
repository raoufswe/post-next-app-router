import { z } from "zod";

export const createInvitationSchema = z.object({
  emailAddress: z.string().email(),
  role: z.string(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>; 