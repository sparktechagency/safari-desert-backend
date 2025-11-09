/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';

import auth from '../../app/middleware/auth';


import { USER_ROLE } from '../Auth/auth.constant';
import { TransferControllers } from './transferOption.controller';




const router = express.Router();

router.post(
  '/create-option',

  auth(
    USER_ROLE.superAdmin,
  
  ),
//   validateRequest(EventCreateSchema),
  TransferControllers.createTransfer,
);

// router.get('/retrive/:userId',UserControllers.getSingleUser)

router.get('/allOptions', TransferControllers.getAllTransfer);



export const TransferRoutes = router;
