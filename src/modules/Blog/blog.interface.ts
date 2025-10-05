import mongoose, { Document } from 'mongoose';

export interface IBlog extends Document {
        user: mongoose.Types.ObjectId;
  title: string;
  image?: string;     
  article: string;    
}

