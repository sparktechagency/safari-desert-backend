import mongoose, { Schema } from "mongoose";
import { Activity, IPackage, ITourOption, Price } from "./package.interface";

// Price sub-schema
const PriceSchema = new Schema<Price>(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true },
  },
  { _id: false } // don't create separate _id for Price subdocs
);



const TourOptionSchema = new Schema<ITourOption>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  currency: { type: String, required: true, default: "AED" },
});

// Package schema
const PackageSchema: Schema = new Schema<IPackage>(
  {
      user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to User model (you should have a 'User' model)
    required: [true, 'User reference is required'],
  },
    title: { type: String, required: true, trim: true },
    coverImage: { type: String,required:true },
    images: { type: [String], default: [] },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    max_adult: { type: Number, required: true, min: 1 },
    child_min_age: { type: Number, required: true, min: 0 },

    pickup: { type: String },
    availability: {
      start: { type: String, required: true },
      end: { type: String, required: true },

    },
     activity: {
    type: [String],
    enum: Object.values(Activity),
    default: [],
  },

    adultPrice: { type: PriceSchema, required: true },
    childPrice: { type: PriceSchema, required: true },
    dune_buggy_ride: { type: PriceSchema},
    single_sitter_dune_buggy: { type: PriceSchema},
    dune_dashing: { type: PriceSchema},
    four_sitter_dune_buggy: { type: PriceSchema },
    quad_bike: { type: PriceSchema },
    camel_bike: { type: PriceSchema },
    tea_cofee_soft_drinks: { type: PriceSchema },
    hena_tattos: { type: PriceSchema },
    fire_show: { type: PriceSchema },
    arabic_costume: { type: PriceSchema },
    shisha_smoking: { type: PriceSchema },
     falcon_picture: { type: PriceSchema },
    sand_boarding: { type: PriceSchema },
    belly_dance: { type: PriceSchema },
  tour_options: [TourOptionSchema],
    discount: { type: Number, min: 0, max: 100 },

    drop_off: { type: String },
    note: { type: String, trim: true },
    refund_policy: { type: String },

    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    tour_plan: { type: [String], default: [] },
    description: { type: String },
    original_price:{type:PriceSchema},
     discount_price:{type:PriceSchema}
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Export model
const PackageModel = mongoose.model<IPackage>('Package', PackageSchema);

export default PackageModel;