import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../app/middleware/validateRequest';

import { AuthControllers } from './auth.controller';

import auth from '../../app/middleware/auth';

import { USER_ROLE } from './auth.constant';
import { upload } from '../../app/middleware/upload';
import { AuthValidation } from './authValidation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerUserValidationSchema),

  AuthControllers.registerUser,
);
router.post('/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.userLogin
);



export const AuthRoutes = router;
