import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { EventServices } from './event.services';
import sendResponse from '../../utils/sendResponse';




const getAllEvent = catchAsync(async(req:Request,res:Response)=>{

  const result = await EventServices.getAllEventFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Events retrived succesfully!',
      data: result,
    });

})
const getSingleEvent = catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await EventServices.getSingleEventFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Event retrived succesfully!',
      data: result,
    });

})


const createEvent = async (
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
    const result = await  EventServices.addEventIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Events Created Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventServices.deleteEventFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event deleted successfully!',
    data: result,
  });
})

const editEvent = async (
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
    
    const result = await EventServices.updateEventFromDB(id,payload)
    sendResponse(res, {
      success: true,
      message: `Event Edited Succesfull`,
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const EventControllers = {
createEvent,getAllEvent,deleteEvent,getSingleEvent,editEvent
};
