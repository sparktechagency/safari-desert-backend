import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { ActivitiesServices } from './activities.services';





const getAllActivities = catchAsync(async(req:Request,res:Response)=>{

  const result = await ActivitiesServices.getAllActivitiesFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Activity retrived succesfully!',
      data: result,
    });

})
const getSingleActivities = catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await ActivitiesServices.getSingleActivitiesFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Activity retrived succesfully!',
      data: result,
    });

})


const createActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
const payload = req.body
payload.image = path
payload.user = req?.user?.userId
  try {
    const result = await  ActivitiesServices.addActivitiesIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Activity Created Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteActivities = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ActivitiesServices.deleteActivitiesFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity deleted successfully!',
    data: result,
  });
})

const editActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    
    //  Only add image to payload if uploaded
    if (req.file?.filename) {
      payload.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const result = await ActivitiesServices.updateActivitiesFromDB(id, payload);
    
    sendResponse(res, {
      success: true,
      message: `Activity Edited Successfully`,
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ActivitiesControllers = {
    createActivities,getAllActivities,getSingleActivities,editActivities,deleteActivities

};
