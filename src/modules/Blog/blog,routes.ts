/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';


import { BlogControllers } from './blog.controller';
import { BlogCreateSchema } from './blog.validation';
import { upload } from '../../app/middleware/multer';




const router = express.Router();

router.post(
  '/create-blog',
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
  validateRequest(BlogCreateSchema),
  BlogControllers.createBlog,
);

// router.get('/retrive/:userId',UserControllers.getSingleUser)

router.get('/allBlogs', BlogControllers.getAllblog);

router.get('/single-blog/:id',BlogControllers.getSingleBlog);


router.delete('/delete-blog/:id',BlogControllers.deleteBlog);
router.patch('/update-blog/:id',
     upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req data--->",req.body.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  
    BlogControllers.editBlog);

export const BlogRoutes = router;
