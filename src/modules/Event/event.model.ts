import mongoose, { Schema } from "mongoose";
import { IEvent } from "./event.interface";

const EventSchema: Schema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String }, // store image URL or path
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// 3. Export the model
const EventModel = mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;