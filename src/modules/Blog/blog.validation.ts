import { z } from "zod";

export const BlogCreateSchema = z
  .object({
    body: z.object({
      title: z.string().min(1),

      article: z.string(),
    }),
  })
  .strict();
