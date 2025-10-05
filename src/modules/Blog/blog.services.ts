// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';


import httpStatus from 'http-status';
import BlogModel from './blog.model';
import { IBlog } from './blog.interface';


const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(BlogModel.find(), query);
  queryBuilder.search(['title', 'article']).filter().sort().paginate();
  const result = await queryBuilder.modelQuery.populate('user');
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};
const getSingleBlogFromDB = async (id: string) => {
  const result = await BlogModel.findById(id).populate('user');
  return result;
};


const addBlogIntoDB = async (payload: IBlog) => {
const mineId = payload.user
  // console.log("services id",payload.serviceId);
  const user = await UserModel.findById(mineId);
  if (!user) {
    throw new Error('User not found');
  }

  const result = (await BlogModel.create(payload)).populate('user');
  return result;
};
const deleteBlogFromDB = async (id: string) => {
  const event = await BlogModel.findByIdAndDelete(id);

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found!');
  }

  return event; // return deleted user if needed
};

const updateBlogFromDB = async (id:string,payload:IBlog)=>{

 const updated = await BlogModel
    .findByIdAndUpdate(
      id,
      { $set: payload },  
      { new: true, runValidators: true, context: "query" }
    )
    .populate("user");

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found!");
  }
    
 return updated
  
}

export const BlogServices = {
 getAllBlogsFromDB,getSingleBlogFromDB,deleteBlogFromDB,updateBlogFromDB,addBlogIntoDB};
