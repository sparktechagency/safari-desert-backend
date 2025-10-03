import  { Document} from 'mongoose';

// Price sub-document interface
export interface Price {
  amount: number;
  currency: string;
}

// Main Package interface extending Mongoose Document
export interface IPackage extends Document {
  Title: string;
  image_multi: string[];
  location: string;
  duration: string;
  max_adult: number;
  child_min_age: number;

  pickup?: string;
  availability?: string[];
  activity?: string[];

  adultPrice: Price;
  childPrice: Price;
  single_sitter_dune_buggy: Price;
  four_sitter_dune_buggy: Price;
  quad_bike: Price;
  camel_bike: Price;

  discount?: number;

  drop_off?: string;
  note?: string;
  refund_policy?: string;

  included?: string[];
  excluded?: string[];
  tour_plan?: string[];
  description?: string;
}
