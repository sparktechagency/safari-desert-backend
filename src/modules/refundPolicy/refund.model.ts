import mongoose from 'mongoose';
import {IRefund } from './refund.interface';


export const refundSchema = new mongoose.Schema<IRefund>(
  {
    refundPolicy: String,
  },
  {
    timestamps: true,
  },
);

const Refund = mongoose.model<IRefund>('refund', refundSchema);
export default Refund;
