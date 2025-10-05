import mongoose, { Schema } from "mongoose";
import { IEvent } from "./event.interface";

const EventSchema: Schema = new Schema<IEvent>(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // Reference to User model (you should have a 'User' model)
        required: [true, 'User reference is required'],
      },
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
const BlogModel = mongoose.model<IEvent>('Event', EventSchema);

export default BlogModel;