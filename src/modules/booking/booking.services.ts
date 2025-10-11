// import AppError from '../../errors/AppError';

import QueryBuilder from '../../app/builder/QueryBuilder';
import bookingModel, { IBooking } from './booking.model';



const getAllBlookingFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(bookingModel.find(), query);
  queryBuilder.search(['date']).filter().sort().paginate();
  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};
const getSingleBookingFromDB = async (id: string) => {
  const result = await bookingModel.findById(id);
  return result;
};


const addBookingIntoDB = async (payload: IBooking) => {


  const result = (await bookingModel.create(payload));
  return result;
};




export const BookingServices = {
 getAllBlookingFromDB,getSingleBookingFromDB,addBookingIntoDB};
