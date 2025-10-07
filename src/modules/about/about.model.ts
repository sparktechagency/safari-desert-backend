import mongoose from 'mongoose';
import { IAbout } from './about.interface';


export const privacyPolicySchema = new mongoose.Schema<IAbout>(
  {
    aboutUs: String,
  },
  {
    timestamps: true,
  },
);

const Terms = mongoose.model<IAbout>('about', privacyPolicySchema);
export default Terms;
