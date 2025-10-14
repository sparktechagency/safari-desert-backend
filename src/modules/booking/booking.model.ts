import mongoose, { Schema, Document } from "mongoose";

export interface IAvailability {
  start: string;
  end: string;
}

export interface ISelectedTourOption {
  id: string | number;
  name: string;
  amount: number;
  currency: string;
  quantity: number;
  selected: true;
}

export interface IPricing {
  tour_price: number;
  additional_price: number;
  grand_total: number;
}

export interface IBooking extends Document {
    bookingId:String
  title: string;
  images: string[];
  location: string;
  availability?: IAvailability;
  drop_off?: string;
  pickup?: string;
  date: string;
  adults: number;
  children: number;
  currency: string;
  tour_options: ISelectedTourOption[];
  pricing: IPricing;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_country?: string;
  pickup_location?: string;
 payment_status:string
 stripe_sessionId:string;
}

const AvailabilitySchema = new Schema<IAvailability>({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const SelectedTourOptionSchema = new Schema<ISelectedTourOption>({
  id: { type: Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selected: { type: Boolean, required: true, default: true },
});

const PricingSchema = new Schema<IPricing>({
  tour_price: { type: Number, required: true },
  additional_price: { type: Number, required: true },
  grand_total: { type: Number, required: true },
});

const BookingSchema = new Schema<IBooking>(
  {
    bookingId:{type:String,required:true},
    title: { type: String, required: true },
    images: { type: [String], default: [] },
    location: { type: String, required: true },
    availability: { type: AvailabilitySchema, required: false },
    drop_off: { type: String },
    pickup: { type: String },
    date: { type: String, required: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    currency: { type: String, default: "AED" },
    tour_options: { type: [SelectedTourOptionSchema], default: [] },
    stripe_sessionId:{type:String,required:true},
    pricing: { type: PricingSchema, required: true },
    customer_name: { type: String },
    customer_email: { type: String },
    customer_phone: { type: String },
    customer_country: { type: String },
    pickup_location: { type: String },
    payment_status:{type:String,required:true}
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
