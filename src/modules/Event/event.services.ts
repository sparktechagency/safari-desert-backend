// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';


import httpStatus from 'http-status';
import EventModel from './event.model';
import { IEvent } from './event.interface';

const getAllEventFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(EventModel.find(), query);
  queryBuilder.search(['title', 'description']).filter().sort().paginate();
  const result = await queryBuilder.modelQuery.populate('user');
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};
const getSingleEventFromDB = async (id: string) => {
  const result = await EventModel.findById(id).populate('user');
  return result;
};


const addEventIntoDB = async (payload: IEvent) => {
const mineId = payload.user
  // console.log("services id",payload.serviceId);
  const user = await UserModel.findById(mineId);
  if (!user) {
    throw new Error('User not found');
  }

  const result = (await EventModel.create(payload)).populate('user');
  return result;
};
const deleteEventFromDB = async (id: string) => {
  const event = await EventModel.findByIdAndDelete(id);

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found!');
  }

  return event; // return deleted user if needed
};

const updateEventFromDB = async (id:string,payload:IEvent)=>{

 const updated = await EventModel
    .findByIdAndUpdate(
      id,
      { $set: payload },  
      { new: true, runValidators: true, context: "query" }
    )
    .populate("user");

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found!");
  }
    
 return updated
  
}

export const EventServices = {
  getAllEventFromDB,getSingleEventFromDB,updateEventFromDB,deleteEventFromDB
,addEventIntoDB};
