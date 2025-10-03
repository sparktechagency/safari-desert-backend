import { Document} from 'mongoose';
export interface IEvent extends Document {
  title: string;
  image?: string;
  start_time: Date;
  end_time: Date;
  description?: string;
}