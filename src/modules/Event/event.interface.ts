import mongoose, { Document} from 'mongoose';
export interface IEvent extends Document {
         user: mongoose.Types.ObjectId;
  title: string;
  image?: string;
  start_time: string;
  end_time: string;
  max_adult: string;
  max_child: string;
  description?: string;
  features:string[]
}