// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';


import httpStatus from 'http-status';
import ActivityModel from './activities.model';
import { IActivities } from './activities.interface';


const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(ActivityModel.find(), query);
  queryBuilder.search(['title', 'description']).filter().sort().paginate();
  const result = await queryBuilder.modelQuery.populate('user');
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};
const getSingleBlogFromDB = async (id: string) => {
  const result = await ActivityModel.findById(id).populate('user');
  return result;
};


const addBlogIntoDB = async (payload: IActivities) => {
const mineId = payload.user
  // console.log("services id",payload.serviceId);
  const user = await UserModel.findById(mineId);
  if (!user) {
    throw new Error('User not found');
  }

  const result = (await ActivityModel.create(payload)).populate('user');
  return result;
};
const deleteBlogFromDB = async (id: string) => {
  const event = await ActivityModel.findByIdAndDelete(id);

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Activity not found!');
  }

  return event; // return deleted user if needed
};

const updateBlogFromDB = async (id:string,payload:IActivities)=>{

 const updated = await ActivityModel
    .findByIdAndUpdate(
      id,
      { $set: payload },  
      { new: true, runValidators: true, context: "query" }
    )
    .populate("user");

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Activity not found!");
  }
    
 return updated
  
}

export const ActivitiesServices = {
 getAllBlogsFromDB,getSingleBlogFromDB,deleteBlogFromDB,updateBlogFromDB,addBlogIntoDB};
