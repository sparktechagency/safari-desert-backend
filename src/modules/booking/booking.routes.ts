/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';


import { BookingControllers } from './booking.controller';




const router = express.Router();

router.post(
  '/create-booking',


//   validateRequest(BlogCreateSchema),
  BookingControllers.createBooking,
);



router.get('/allBooking', BookingControllers.getAllbooking);

router.get('/single-booking/:id',BookingControllers.getSingleBooking);



export const BookingRoutes = router;
