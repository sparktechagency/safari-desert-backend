
import {Request, Response } from 'express';

import { UserServices } from './user.services';
import httpStatus from 'http-status';

import {

  TEditProfile,

} from './user.constant';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';



const updateProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
       const id =req?.user?.userId

    const payload: TEditProfile = { ...req.body };


    if (req.file){
      const path = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; 
      payload.image = path; 
    }


    const result = await UserServices.updateProfileFromDB(id, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  },
);




export const UserControllers = {

  updateProfile,

};
