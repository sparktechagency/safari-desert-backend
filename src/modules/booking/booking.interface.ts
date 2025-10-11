/* ---------- Booking Types ---------- */
export interface Availability {
  start: string;
  end: string;
}

export interface SelectedTourOption {
  id: string | number;
  name: string;
  amount: number;
  currency: string;
  quantity: number; // >= 1
  selected: true;
}

export interface Pricing {
  tour_price: number;
  additional_price: number;
  grand_total: number;
}

export interface Booking {
  _id?: string;
  title: string;
  images: string[];
  location: string;
  availability?: Availability;
  drop_off?: string;
  pickup?: string;

  date: string;
  adults: number;
  children: number;
  currency: string;
  tour_options: SelectedTourOption[];

  pricing: Pricing;
payment_status:string;
  // personal info
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_country?: string;
  pickup_location?: string;

  createdAt?: string;
  updatedAt?: string;
}
