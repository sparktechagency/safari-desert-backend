import mongoose, { Schema } from "mongoose";
import { IActivities } from "./activities.interface";

// Mongoose schema
const BlogSchema: Schema = new Schema<IActivities>(
  {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: [true, 'User reference is required'],
          },
    title: { type: String, required: true, trim: true },
    image: { type: String }, 
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

// Export model
const ActivityModel = mongoose.model<IActivities>('Activities', BlogSchema);

export default ActivityModel;
