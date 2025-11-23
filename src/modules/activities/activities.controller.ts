import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { ActivitiesServices } from './activities.services';





const getAllActivities = catchAsync(async(req:Request,res:Response)=>{

  const result = await ActivitiesServices.getAllBlogsFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blogs retrived succesfully!',
      data: result,
    });

})
const getSingleActivities = catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await ActivitiesServices.getSingleBlogFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog retrived succesfully!',
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
    const result = await  ActivitiesServices.addBlogIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Blog Created Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteActivities = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ActivitiesServices.deleteBlogFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully!',
    data: result,
  });
})

const editActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  try {
 
  const {id} = req.params;
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
const payload = req.body;
payload.image = path;


    // console.log("Data with file paths: ", data);
    
    const result = await ActivitiesServices.updateBlogFromDB(id,payload)
    sendResponse(res, {
      success: true,
      message: `Blog Edited Succesfull`,
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
