import mongoose, { Schema } from "mongoose";
import { IPackage, Price } from "./package.interface";

// Price sub-schema
const PriceSchema = new Schema<Price>(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true },
  },
  { _id: false } // don't create separate _id for Price subdocs
);

// Package schema
const PackageSchema: Schema = new Schema<IPackage>(
  {
    Title: { type: String, required: true, trim: true },
    image_multi: { type: [String], default: [] },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    max_adult: { type: Number, required: true, min: 1 },
    child_min_age: { type: Number, required: true, min: 0 },

    pickup: { type: String },
    availability: { type: [String], default: [] },
    activity: { type: [String], default: [] },

    adultPrice: { type: PriceSchema, required: true },
    childPrice: { type: PriceSchema, required: true },
    single_sitter_dune_buggy: { type: PriceSchema, required: true },
    four_sitter_dune_buggy: { type: PriceSchema, required: true },
    quad_bike: { type: PriceSchema, required: true },
    camel_bike: { type: PriceSchema, required: true },

    discount: { type: Number, min: 0, max: 100 },

    drop_off: { type: String },
    note: { type: String, trim: true },
    refund_policy: { type: String },

    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    tour_plan: { type: [String], default: [] },
    description: { type: String },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Export model
const PackageModel = mongoose.model<IPackage>('Package', PackageSchema);

export default PackageModel;