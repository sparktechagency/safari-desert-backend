import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.services';





const getAllbooking = catchAsync(async(req:Request,res:Response)=>{

  const result = await BookingServices.getAllBlookingFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking retrived succesfully!',
      data: result,
    });

})
const getSingleBooking = catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await BookingServices.getSingleBookingFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking retrived succesfully!',
      data: result,
    });

})


const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//
const payload = req.body

  try {
    const result = await  BookingServices.addBookingIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Booking Created Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};



export const BookingControllers = {
getAllbooking,createBooking,getSingleBooking
};
