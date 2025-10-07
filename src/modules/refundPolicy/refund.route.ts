import express from 'express';
import { USER_ROLE } from '../Auth/auth.constant';
import auth from '../../app/middleware/auth';
import termsController from './refund.controller';



const refundRouter = express.Router();

// Route to create or update Privacy Policy content (only accessible to admin or super-admin)
refundRouter.post(
  '/create-or-update',
  auth(USER_ROLE.superAdmin,),
  termsController.createOrUpdateTerms
);

// Route to retrieve Privacy Policy content (accessible to everyone)
refundRouter.get(
  '/retrive',
 termsController.getTerms
);

export default refundRouter;