import mongoose, { Document } from 'mongoose';

export interface IActivities extends Document {
        user: mongoose.Types.ObjectId;
  title: string;
  image: string;     
  description: string;    
}

