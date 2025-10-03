export interface Price {
  amount: number;
  currency: string;
}

export interface Package {
  _id: string;                     // Primary Key
  Title: string;
  image_multi: string[];           // Multiple image URLs
  location: string;
  duration: string;
  max_adult: number;
  child_min_age: number;

  pickup?: string;                 // Timings, e.g., "09:00"
  availability?: string[];         // e.g., ["daily", "weekends"]
  activity?: string[];

  // Pricing
  adultPrice: Price;
  childPrice: Price;
  single_sitter_dune_buggy: Price;
  four_sitter_dune_buggy: Price;
  quad_bike: Price;
  camel_bike: Price;

  discount?: number;               // Overall discount percentage

  drop_off?: string;               // Timings
  note?: string;
  refund_policy?: string;

  included?: string[];
  excluded?: string[];
  tour_plan?: string[];
  description?: string;
}
