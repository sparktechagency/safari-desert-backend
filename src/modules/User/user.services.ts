/* eslint-disable @typescript-eslint/no-explicit-any */

import bookingModel from "../booking/booking.model";
import { TEditProfile } from "./user.constant";

import { UserModel } from "./user.model";
import httpStatus from "http-status";

const updateProfileFromDB = async (id: string, payload: TEditProfile) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};
const getMyProfileFromDB = async (id: string, ) => {
  const result = await UserModel.findById(id);

  return result;
};

const getDashboardStatsFromDB = async (year: number) => {
  const bookings = await bookingModel.find({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00Z`),
      $lte: new Date(`${year}-12-31T23:59:59Z`),
    },
  });

  const totalBookings = bookings.length;

  // Initialize month counts
  const monthlyCounts = Array(12).fill(0);

  // Count bookings by month
  bookings.forEach((b) => {
    const month = new Date(b.createdAt).getMonth(); // 0–11
    monthlyCounts[month]++;
  });

  // Format for frontend graph (Jan–Dec)
  const monthlyData = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((label, index) => ({
    month: label,
    total: monthlyCounts[index],
  }));

  return { totalBookings, monthlyData };
};


export const UserServices = {
  updateProfileFromDB,
  getDashboardStatsFromDB,
  getMyProfileFromDB
};
