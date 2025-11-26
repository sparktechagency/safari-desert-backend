/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';


import { EventControllers } from './event.controller';
import { EventCreateSchema } from './event.validation';
import { upload } from '../../app/middleware/multer';


const router = express.Router();

router.post(
  '/create-event',
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
  validateRequest(EventCreateSchema),
  EventControllers.createEvent,
);

// router.get('/retrive/:userId',UserControllers.getSingleUser)

router.get('/allEvents', EventControllers.getAllEvent);

router.get('/single-event/:id',EventControllers.getSingleEvent);


router.delete('/delete-event/:id',EventControllers.deleteEvent);
router.patch('/update-event/:id',
     upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req data--->",req.body.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  
    EventControllers.editEvent);

export const EventRoutes = router;
