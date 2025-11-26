/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import validateRequest from '../../app/middleware/validateRequest';

import { UserControllers } from './user.controller';

import { editProfileSchema } from '../Auth/authValidation';
import auth from '../../app/middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { upload } from '../../app/middleware/multer';

const router = express.Router();







router.patch(
  '/edit-profile',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        const parsedData = JSON.parse(req.body.data);

        // Merge parsed JSON fields into req.body (preserve file info)
        req.body = {
          ...req.body,
          ...parsedData,
        };
      }


      next();
    } catch (error) {
   
      return res.status(400).json({ message: 'Invalid data format' });
    }
  },
  auth(USER_ROLE.superAdmin),
  validateRequest(editProfileSchema),
  UserControllers.updateProfile,
);
router.get(
  '/my-profile',
 
  auth(USER_ROLE.superAdmin),
  UserControllers.getMyProfile,
);



router.get('/dashboard/stats/:year', UserControllers.getDashboardStats);

export const UserRoutes = router;
