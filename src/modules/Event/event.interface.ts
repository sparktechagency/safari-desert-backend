import mongoose, { Document} from 'mongoose';
export interface IEvent extends Document {
         user: mongoose.Types.ObjectId;
  title: string;
  image?: string;
  start_time: Date;
  end_time: Date;
  description?: string;
}