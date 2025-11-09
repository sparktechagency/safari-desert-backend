import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { TransferServices } from './transferOption.services';





const getAllTransfer = catchAsync(async(req:Request,res:Response)=>{

  const result = await TransferServices.getAllTransferFromDB()
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transfer option retrived succesfully!',
      data: result,
    });

})



const createTransfer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);

const payload = req.body

  try {
    const result = await  TransferServices.addTransferOptionIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Transfer option Created Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};





export const TransferControllers = {
createTransfer,getAllTransfer
};
