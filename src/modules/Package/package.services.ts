// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';


import httpStatus from 'http-status';
import PackageModel from './package.model';
import { IPackage, Price, TReview } from './package.interface';
import mongoose, { Types } from 'mongoose';
import { sanitizeUpdatePayload } from '../../utils/senitizeUpdatePayload';

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

// export const addPackageIntoDB = async (payload: IPackage) => {
//   const mineId = payload.user;
//   console.log("payload---form--service--->", payload);

//   const user = await UserModel.findById(mineId);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   // All service fields that can have a Price
//   // const priceFields: (keyof IPackage)[] = [
//   //   "single_sitter_dune_buggy",
//   //   "four_sitter_dune_buggy",
//   //   "dune_dashing",
//   //   "quad_bike",
//   //   "camel_bike",
//   //   "tea_cofee_soft_drinks",
//   //   "hena_tattos",
//   //   "fire_show",
//   //   "arabic_costume",
//   //   "shisha_smoking",
//   //   "falcon_picture",
//   //   "sand_boarding",
//   //   "belly_dance",
//   // ];

//   // --- Calculate total amount ---
//   let totalAmount = 0;
//   for (const field of priceFields) {
//     const price = payload[field] as Price | undefined;
//     if (price?.amount && typeof price.amount === "number") {
//       totalAmount += price.amount;
//     }
//   }

//   // --- Base total price ---
//   payload.original_price = {
//     amount: totalAmount,
//     currency: "AED", // adjust or derive dynamically if needed
//   };

//   // --- Apply discount if exists ---
//   if (payload.discount && payload.discount > 0) {
//     const discountPercentage = Math.min(payload.discount, 100); // cap at 100%
//     const discountedAmount = totalAmount - (totalAmount * discountPercentage) / 100;

//     payload.discount_price = {
//       amount: parseFloat(discountedAmount.toFixed(2)),
//       currency: "AED",
//     };
//   } 




//     // --- Collect all existing service fields into tour_options[] ---
//   const tourOptions: {
//     name: string;
//     amount: number;
//     currency: string;
//     quantity:number;
//   }[] = [];

//   for (const field of priceFields) {
//     const price = payload[field] as Price | undefined;
//     if (price?.amount && typeof price.amount === "number") {
//       tourOptions.push({
//         name: field,
//         amount: price.amount,
//         currency: price.currency || "AED",
//         quantity:1
//       });
//     }
//   }

//   // --- Attach the array to payload ---
//   payload.tour_options = tourOptions;
//   const result = (await PackageModel.create(payload)).populate("user");
//   return result;
// };

export const addPackageIntoDB = async (payload: IPackage) => {
  const mineId = payload.user;
  console.log("payload---form--service--->", payload);

  const user = await UserModel.findById(mineId);
  if (!user) {
    throw new Error("User not found");
  }

  // --- Calculate total from activityIncluded ---
  const activities = payload.activityIncluded ?? [];

  let totalAmount = 0;

  for (const activity of activities) {
    // activity.amount.amount hocche PriceSchema er amount
    const priceAmount = activity?.amount?.amount;
    if (typeof priceAmount !== "number") continue;

    const quantity =
      typeof activity.quantity === "number" && activity.quantity > 0
        ? activity.quantity
        : 1;

    totalAmount += priceAmount * quantity;
  }

  // Currency ta chaile activity theke nite paro, na hole 'AED'
  const baseCurrency =
    activities[0]?.amount?.currency ||
    activities[0]?.currency ||
    "AED";

  // --- Set original_price ---
  payload.original_price = {
    amount: totalAmount,
    currency: baseCurrency,
  };

  // --- Apply discount if exists ---
  if (payload.discount && payload.discount > 0) {
    const discountPercentage = Math.min(payload.discount, 100); // 100% er beshi jeno na hoy
    const discountedAmount =
      totalAmount - (totalAmount * discountPercentage) / 100;

    payload.discount_price = {
      amount: Number(discountedAmount.toFixed(2)),
      currency: baseCurrency,
    };
  } 

  const result = await PackageModel.create(payload);
  return result.populate("user");
};


const deletePackageFromDB = async (id: string) => {
  const Package = await PackageModel.findByIdAndDelete(id);

  if (!Package) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found!');
  }

  return Package; // return deleted user if needed
};

// const updatePackageFromDB = async (id:string,payload:IPackage)=>{

//  const updated = await PackageModel
//     .findByIdAndUpdate(
//       id,
//       { $set: payload },  
//       { new: true, runValidators: true, context: "query" }
//     )
//     .populate("user");

//   if (!updated) {
//     throw new AppError(httpStatus.NOT_FOUND, "Package not found!");
//   }
    
//  return updated
  
// }

export const updatePackageFromDB = async (
  id: string,
  payload: Partial<IPackage>
) => {
  // 1) prothome payload clean kore nao
  const safePayload = sanitizeUpdatePayload(payload);

  const hasActivityUpdate = Array.isArray(safePayload.activityIncluded);
  const hasDiscountUpdate = typeof safePayload.discount === "number";

  // 🟢 CASE 1: activityIncluded & discount konotai change hocche na
  if (!hasActivityUpdate && !hasDiscountUpdate) {
    const updated = await PackageModel
      .findByIdAndUpdate(
        id,
        { $set: safePayload }, // ⬅️ clean payload use hocche
        { new: true, runValidators: true, context: "query" }
      )
      .populate("user");

    if (!updated) {
      throw new AppError(httpStatus.NOT_FOUND, "Package not found!");
    }

    return updated;
  }

  // 🟡 CASE 2: activityIncluded / discount er jekono ekta change hocche
  // -> price abar theke calculate korte hobe
  const existing = await PackageModel.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found!");
  }

  const updateDoc: any = { $set: { ...safePayload } };

  // final activity list
  const finalActivities =
    hasActivityUpdate && safePayload.activityIncluded
      ? safePayload.activityIncluded
      : existing.activityIncluded || [];

  let totalAmount = 0;

  let baseCurrency =
    (finalActivities[0] as any)?.amount?.currency ||
    (finalActivities[0] as any)?.currency ||
    existing.original_price?.currency ||
    "AED";

  if (finalActivities.length > 0) {
    for (const act of finalActivities as any[]) {
      const priceAmount = act?.amount?.amount;
      if (typeof priceAmount !== "number") continue;

      const qty =
        typeof act.quantity === "number" && act.quantity > 0
          ? act.quantity
          : 1;

      totalAmount += priceAmount * qty;
    }
  } else {
    totalAmount = existing.original_price?.amount ?? 0;
  }

  updateDoc.$set.original_price = {
    amount: totalAmount,
    currency: baseCurrency,
  };

  const discountPercent = hasDiscountUpdate
    ? (safePayload.discount as number)
    : existing.discount ?? 0;

  if (discountPercent > 0 && totalAmount > 0) {
    const d = Math.min(discountPercent, 100);
    const discounted = totalAmount - (totalAmount * d) / 100;

    updateDoc.$set.discount_price = {
      amount: Number(discounted.toFixed(2)),
      currency: baseCurrency,
    };
  } else {
    if (!updateDoc.$unset) updateDoc.$unset = {};
    updateDoc.$unset.discount_price = 1;
  }

  const updated = await PackageModel
    .findByIdAndUpdate(id, updateDoc, {
      new: true,
      runValidators: true,
      context: "query",
    })
    .populate("user");

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found!");
  }

  return updated;
};



export const addReviewIntoDB = async (payload: TReview) => {
  const { package_id, user_name, rating, message } = payload;

  // ...validate package_id, ensure package exists...

  const reviewDoc = {
    user_name,
    package_id,      // <-- add this because your schema requires it
    rating,
    message,
  };

  const updated = await PackageModel.findByIdAndUpdate(
    package_id,
    { $push: { review: reviewDoc } },
    { new: true, runValidators: true }
  );

  if (!updated) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to add review');
  return updated;
};
















export const PackageServices = {
 getAllPackageFromDB,getSinglePackageFromDB,addPackageIntoDB,deletePackageFromDB,updatePackageFromDB,addReviewIntoDB
};
