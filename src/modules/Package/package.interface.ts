import  mongoose, { Document} from 'mongoose';

// Price sub-document interface
export interface Price {
  amount: number;
  currency: string;
}
export interface Availability {
  start: string;
  end: string;
}
// src/types/activity.ts

export enum Activity {
  DUNE_BASHING = "Dune Bashing",
  CAMEL_RIDE = "Camel Ride",
  QUAD_BIKING = "Quad Biking",
  DUNE_BUGGY_RIDE = "Dune Buggy Ride",
  TEA_COFFEE_SOFT_DRINKS = "Tea, Coffee, & Soft Drinks",
  HENNA_TATTOOS = "Henna Tattoos",
  FIRE_SHOW = "Fire Show in the Desert",
  ARABIC_COSTUMES = "Arabic Costumes",
  SHISHA_SMOKING = "Shisha Smoking",
  FALCON_PICTURES = "Falcon To Take Pictures",
  SAND_BOARDING = "Sand-Boarding",
  BELLY_DANCE_SHOW = "Belly Dance Show",
}

// Main Package interface extending Mongoose Document
export interface IPackage extends Document {
     user: mongoose.Types.ObjectId;
  title: string;
  coverImage: string;
  images: string[];
  location: string;
  duration: string;
  max_adult: number;
  child_min_age: number;

  pickup?: string;
  availability:Availability;
  activity?: Activity[];

  adultPrice: Price;
  childPrice: Price;
  single_sitter_dune_buggy?: Price;
  four_sitter_dune_buggy?: Price;
  dune_dashing?:Price;
  quad_bike?: Price;
  camel_bike?: Price;
  tea_cofee_soft_drinks?: Price;
  hena_tattos?: Price;
  fire_show?: Price;
  arabic_costume?: Price;
  shisha_smoking?: Price;
  falcon_picture?:Price;
  sand_boarding:Price;
  belly_dance:Price

  discount?: number;

  drop_off?: string;
  note?: string;
  refund_policy?: string;

  included?: string[];
  excluded?: string[];
  tour_plan?: string[];
  description?: string;
  original_price:Price
  discount_price?:Price
}
