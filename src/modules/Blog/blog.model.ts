import mongoose, { Schema } from "mongoose";
import { IBlog } from "./blog.interface";

// Mongoose schema
const BlogSchema: Schema = new Schema<IBlog>(
  {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',  // Reference to User model (you should have a 'User' model)
            required: [true, 'User reference is required'],
          },
    title: { type: String, required: true, trim: true },
    image: { type: String }, // store image URL or path
    article: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Export model
const BlogModel = mongoose.model<IBlog>('Blog', BlogSchema);

export default BlogModel;
