import mongoose, { Schema } from "mongoose";
import { IBlog } from "./blog.interface";

// Mongoose schema
const BlogSchema: Schema = new Schema<IBlog>(
  {
    Title: { type: String, required: true, trim: true },
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
