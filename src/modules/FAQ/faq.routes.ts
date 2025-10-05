/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';

import { upload } from '../../app/middleware/upload';
import { FaqControllers } from './faq.controller';


const router = express.Router();

router.post(
  '/create-event',

  auth(
    USER_ROLE.superAdmin,
  
  ),
//   validateRequest(EventCreateSchema),
  FaqControllers.createFAQ,
);

// router.get('/retrive/:userId',UserControllers.getSingleUser)

router.get('/allEvents', FaqControllers.getAllFaq);

router.get('/single-event/:id',FaqControllers.getSingleFAQ);


router.delete('/delete-event/:id',FaqControllers.deleteFaq);
router.patch('/update-event/:id',
  
    FaqControllers.editFaq);

export const EventRoutes = router;
