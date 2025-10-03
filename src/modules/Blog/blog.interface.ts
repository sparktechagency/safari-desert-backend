import { Document } from 'mongoose';

// TypeScript interface
export interface IBlog extends Document {
  Title: string;
  image?: string;     // optional, could be URL or file path
  article: string;    // main blog content
}

