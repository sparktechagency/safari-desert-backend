// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';


import httpStatus from 'http-status';
import PackageModel from './package.model';
import { IPackage } from './package.interface';

const getAllPackageFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(PackageModel .find(), query);
  queryBuilder.search(['activity', 'availability','child_min_age','max_adult']).filter().sort().paginate();
  const result = await queryBuilder.modelQuery.populate('user');
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};
const getSinglePackageFromDB = async (id: string) => {
  const result = await PackageModel.findById(id).populate('user');
  return result;
};
;

const addPackageIntoDB = async (payload: IPackage) => {
const mineId = payload.user
  // console.log("services id",payload.serviceId);
  const user = await UserModel.findById(mineId);
  if (!user) {
    throw new Error('User not found');
  }

  const result = (await PackageModel.create(payload)).populate('user');
  return result;
};
const deletePackageFromDB = async (id: string) => {
  const article = await PackageModel.findByIdAndDelete(id);

  if (!article) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found!');
  }

  return article; // return deleted user if needed
};

const updatePackageFromDB = async (id:string,payload:IPackage)=>{

 const updated = await PackageModel
    .findByIdAndUpdate(
      id,
      { $set: payload },                 // শুধু নতুন ইনপুট সেট করবে
      { new: true, runValidators: true, context: "query" }
    )
    .populate("user");

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found!");
  }
    
 return updated
  
}

export const PackageServices = {
 getAllPackageFromDB,getSinglePackageFromDB,addPackageIntoDB,deletePackageFromDB,updatePackageFromDB
};
