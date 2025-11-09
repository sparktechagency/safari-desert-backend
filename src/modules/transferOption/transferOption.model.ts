import mongoose, { Schema, Document } from "mongoose";


export interface ITransferOption {
  transfer_option: string;
  
}

export interface ITransfer extends Document {
     transfer_option: string;
}


const TransferSchema = new Schema<ITransfer>(
  {
 
         transfer_option: { type: String, required: true },
  }
);


export const TransferModel = mongoose.model<ITransfer>('Transfer', TransferSchema);