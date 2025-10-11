// zod/package.schema.ts
import { z } from "zod";
import { Activity } from "./package.interface";

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

// Validate date string in YYYY-MM-DD format
const dateStringZ = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date in YYYY-MM-DD format");

// Availability object with start and end
export const availabilityZ = z
  .object({
    start: dateStringZ,
    end: dateStringZ,
  })
  .refine((data) => data.end >= data.start, {
    message: "End date must be the same or after start date",
    path: ["end"], // error will appear on the 'end' field
  });

/** Reusable array of trimmed strings; defaults to [] when omitted. */
const stringArrayZ = z.array(z.string().trim()).default([]);

/** Core schema for your Package document (used for create). */
export const createPackage = z
  .object({

    body:z.object({

        
            title: z.string().trim().min(1, "Title is required"),
            location: z.string().trim().min(1),
            duration: z.string().trim().min(1),
            max_adult: z.number().int().min(1),
            child_min_age: z.number().int().min(0),
        
            pickup: z.string().trim().optional(),
            availability: availabilityZ,
             activity: z
    .array(z.nativeEnum(Activity))
    .default([])
    .refine((val) => val.length > 0, "At least one activity required"),
        
            adultPrice: priceZ,
            childPrice: priceZ,
            dune_buggy_ride: priceZ.optional(),
            single_sitter_dune_buggy: priceZ.optional(),
            dune_dashing: priceZ.optional(),
            four_sitter_dune_buggy: priceZ.optional(),
            quad_bike: priceZ.optional(),
           tea_cofee_soft_drinks: priceZ.optional(),
            camel_bike: priceZ.optional(),
            hena_tattos: priceZ.optional(),
            fire_show: priceZ.optional(),
            arabic_costume: priceZ.optional(),
            shisha_smoking: priceZ.optional(),
             falcon_picture: priceZ.optional(),
             sand_boarding: priceZ.optional(),
             belly_dance: priceZ.optional(),
        
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


