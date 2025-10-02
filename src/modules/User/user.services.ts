/* eslint-disable @typescript-eslint/no-explicit-any */

import {

  TEditProfile,
} from './user.constant';

import { UserModel } from './user.model';
import httpStatus from 'http-status';

const updateProfileFromDB = async (id: string, payload: TEditProfile) => {


  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};














export const UserServices = {

  updateProfileFromDB,

};
