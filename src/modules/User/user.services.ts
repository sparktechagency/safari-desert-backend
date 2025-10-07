/* eslint-disable @typescript-eslint/no-explicit-any */

import { TEditProfile } from "./user.constant";

import { UserModel } from "./user.model";
import httpStatus from "http-status";

const updateProfileFromDB = async (id: string, payload: TEditProfile) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const getDashboardStatsFromDB = async () => {
  return "Dashboard metadata will be available once the server is live."
  const users = await UserModel.find();

  // total user count
  const totalUsers = users.length;

  // role-wise stats
  const stats = users.reduce(
    (acc, user) => {
      if (user.role === "user") acc.totalClient++;
      if (user.role === "contractor") acc.totalContractor++;
      if (user.role === "vipContractor") acc.totalVipContractor++;
      if (user.role === "vipMember") acc.totalVipMember++;
      if (user.role === "admin") acc.totalAdmin++;
      return acc;
    },
    {
      totalClient: 0,
      totalContractor: 0,
      totalVipContractor: 0,
      totalVipMember: 0,
      totalAdmin: 0,
    }
  );

  const finalStats = {
    totalUsers,
    ...stats,
  };

  // console.log("Dashboard Stats ---->", finalStats);
  return finalStats;
};


export const UserServices = {
  updateProfileFromDB,
  getDashboardStatsFromDB
};
