import express from 'express';
import { USER_ROLE } from '../Auth/auth.constant';
import auth from '../../app/middleware/auth';
import PrivacyPolicyController from './PrivacyPolicy.controller';


const privacyPolicyRouter = express.Router();

// Route to create or update Privacy Policy content (only accessible to admin or super-admin)
privacyPolicyRouter.post(
  '/create-or-update',
  auth(USER_ROLE.superAdmin,),
  PrivacyPolicyController.createOrUpdatePrivacyPolicy
);

// Route to retrieve Privacy Policy content (accessible to everyone)
privacyPolicyRouter.get(
  '/retrive',
  PrivacyPolicyController.getPrivacyPolicy
);

export default privacyPolicyRouter;