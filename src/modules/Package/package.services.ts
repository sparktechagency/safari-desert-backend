// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';


import httpStatus from 'http-status';
import PackageModel from './package.model';
import { IPackage, Price } from './package.interface';

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

// const addPackageIntoDB = async (payload: IPackage) => {

// const mineId = payload.user
// console.log("payload---form--service--->",payload);
//   // console.log("services id",payload.serviceId);
//   const user = await UserModel.findById(mineId);
//   if (!user) {
//     throw new Error('User not found');
//   }

//   const result = (await PackageModel.create(payload)).populate('user');
//   return result;
// };

export const addPackageIntoDB = async (payload: IPackage) => {
  const mineId = payload.user;
  console.log("payload---form--service--->", payload);

  const user = await UserModel.findById(mineId);
  if (!user) {
    throw new Error("User not found");
  }

  // List of optional service fields that may contain Price objects
  const priceFields: (keyof IPackage)[] = [
    "single_sitter_dune_buggy",
    "four_sitter_dune_buggy",
    "dune_dashing",
    "quad_bike",
    "camel_bike",
    "tea_cofee_soft_drinks",
    "hena_tattos",
    "fire_show",
    "arabic_costume",
    "shisha_smoking",
    "falcon_picture",
    "sand_boarding",
    "belly_dance",
  ];

  // Sum all available Price.amount values from payload
  let totalAmount = 0;
  for (const field of priceFields) {
    const price = payload[field] as Price | undefined;
    if (price && typeof price.amount === "number") {
      totalAmount += price.amount;
    }
  }

  // Set the total price (you can adjust currency logic as needed)
  payload.price = {
    amount: totalAmount,
    currency: "AED", 
  };

  const result = (await PackageModel.create(payload)).populate("user");
  return result;
};





const deletePackageFromDB = async (id: string) => {
  const Package = await PackageModel.findByIdAndDelete(id);

  if (!Package) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found!');
  }

  return Package; // return deleted user if needed
};

const updatePackageFromDB = async (id:string,payload:IPackage)=>{

 const updated = await PackageModel
    .findByIdAndUpdate(
      id,
      { $set: payload },  
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
