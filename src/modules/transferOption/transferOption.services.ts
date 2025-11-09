// import AppError from '../../errors/AppError';


import { ITransferOption, TransferModel } from './transferOption.model';




const getAllTransferFromDB = async () => {

  const result = await TransferModel.find();
 

  return result;
};

const addTransferOptionIntoDB = async (payload: ITransferOption) => {
  const result = (await TransferModel.create(payload));
  return result;
};




export const TransferServices = {
 getAllTransferFromDB,addTransferOptionIntoDB};
