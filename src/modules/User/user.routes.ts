/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import validateRequest from '../../app/middleware/validateRequest';

import { UserControllers } from './user.controller';
import { upload } from '../../app/middleware/upload';
import { editProfileSchema } from '../Auth/authValidation';

const router = express.Router();








router.patch(
  '/edit-profile',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req--->",req.body);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(editProfileSchema),
  UserControllers.updateProfile,
);




// router.get('/dashboard/stats', UserControllers.getDashboardStats);

export const UserRoutes = router;
