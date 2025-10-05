// zod/package.schema.ts
import { z } from "zod";

/** Simple ObjectId validator (24 hex chars). */
export const objectIdZ = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/** ISO 4217 currency code (e.g., USD, EUR, BDT). Normalized to uppercase. */
export const currencyZ = z
  .string()
  .trim()
  .transform((s) => s.toUpperCase())
  .refine((s) => /^[A-Z]{3}$/.test(s), {
    message: "currency must be a 3-letter ISO code (e.g., USD)",
  });

/** Price sub-schema */
export const priceZ = z
  .object({
    amount: z.number().finite().nonnegative(),
    currency: currencyZ,
  })
  .strict();

/** Reusable array of trimmed strings; defaults to [] when omitted. */
const stringArrayZ = z.array(z.string().trim()).default([]);

/** Core schema for your Package document (used for create). */
export const createPackage = z
  .object({

    body:z.object({

        
            Title: z.string().trim().min(1, "Title is required"),
            location: z.string().trim().min(1),
            duration: z.string().trim().min(1),
            max_adult: z.number().int().min(1),
            child_min_age: z.number().int().min(0),
        
            pickup: z.string().trim().optional(),
            availability: stringArrayZ,
            activity: stringArrayZ,
        
            adultPrice: priceZ,
            childPrice: priceZ,
            single_sitter_dune_buggy: priceZ,
            four_sitter_dune_buggy: priceZ,
            quad_bike: priceZ,
            camel_bike: priceZ,
        
            discount: z.number().min(0).max(100).optional(),
        
            drop_off: z.string().trim().optional(),
            note: z.string().trim().optional(),
            refund_policy: z.string().trim().optional(),
        
            included: stringArrayZ,
            excluded: stringArrayZ,
            tour_plan: stringArrayZ,
            description: z.string().trim().optional(),
    })
  }).strict();


