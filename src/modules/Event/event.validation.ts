import { z } from "zod";

export const EventCreateSchema = z.object({
    body:z.object({

        title: z.string().min(1),
        start_time:z.string(),
        end_time:z.string(),
        description: z.string().optional(),
    })
}).strict()