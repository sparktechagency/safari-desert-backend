import { Document } from 'mongoose';

export interface IRefund extends Document {
  refundPolicy: string;
}