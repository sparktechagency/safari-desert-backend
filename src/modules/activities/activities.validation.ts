import { z } from "zod";

export const ActivityCreateSchema = z
  .object({
    body: z.object({
      title: z.string().min(1),
      description: z.string(),
    }),
  })
  .strict();
