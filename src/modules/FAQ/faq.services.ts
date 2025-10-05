// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';



import httpStatus from 'http-status';
import FAQModel from './faq.model';
import { IFAQ } from './faq.interface';


const getAllFAQFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(FAQModel.find(), query);
  queryBuilder.search(['title', 'description']).filter().sort().paginate();
  const result = await queryBuilder.modelQuery.populate('user');
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};
const getSingleFAQFromDB = async (id: string) => {
  const result = await FAQModel.findById(id).populate('user');
  return result;
};


const addFAQIntoDB = async (payload: IFAQ) => {


  const result = (await FAQModel.create(payload)).populate('user');
  return result;
};
const deleteFAQFromDB = async (id: string) => {
  const event = await FAQModel.findByIdAndDelete(id);

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found!');
  }

  return event; // return deleted user if needed
};

const updateFAQFromDB = async (id:string,payload:IFAQ)=>{

 const updated = await FAQModel
    .findByIdAndUpdate(
      id,
      { $set: payload },  
      { new: true, runValidators: true, context: "query" }
    )
    .populate("user");

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found!");
  }
    
 return updated
  
}

export const FAQServices = {
getAllFAQFromDB,addFAQIntoDB,updateFAQFromDB,deleteFAQFromDB,getSingleFAQFromDB
};
