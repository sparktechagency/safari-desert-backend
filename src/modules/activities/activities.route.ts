
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';

import { ActivityCreateSchema } from './activities.validation';
import { ActivitiesControllers } from './activities.controller';
import { upload } from '../../app/middleware/multer';





const router = express.Router();

router.post(
  '/create-activity',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req data--->",req.body.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },

  auth(
    USER_ROLE.superAdmin,
  
  ),
  validateRequest(ActivityCreateSchema),
  ActivitiesControllers.createActivities,
);

// router.get('/retrive/:userId',UserControllers.getSingleUser)

router.get('/allActivities', ActivitiesControllers.getAllActivities);

router.get('/single-activity/:id',ActivitiesControllers.getSingleActivities);


router.delete('/delete-activity/:id',ActivitiesControllers.deleteActivities,  auth(
    USER_ROLE.superAdmin,
  ),);
router.patch('/update-activity/:id',
     upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req data--->",req.body.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
    auth(
    USER_ROLE.superAdmin,
  
  ),
    ActivitiesControllers.editActivities);

export const ActivityRoutes = router;
