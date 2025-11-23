import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.services';




const getAllblog = catchAsync(async(req:Request,res:Response)=>{

  const result = await BlogServices.getAllBlogsFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blogs retrived succesfully!',
      data: result,
    });

})
const getSingleBlog = catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await BlogServices.getSingleBlogFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog retrived succesfully!',
      data: result,
    });

})


const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
const payload = req.body
payload.image = path
payload.user = req?.user?.userId
  try {
    const result = await  BlogServices.addBlogIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Blog Created Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await BlogServices.deleteBlogFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully!',
    data: result,
  });
})

const editBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  try {
 
  const {id} = req.params;
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
const payload = req.body;
   // Only add image to payload if uploaded
    if (req.file?.filename) {
      payload.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }


    // console.log("Data with file paths: ", data);
    
    const result = await BlogServices.updateBlogFromDB(id,payload)
    sendResponse(res, {
      success: true,
      message: `Blog Edited Succesfull`,
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const BlogControllers = {
createBlog,getAllblog,getSingleBlog,editBlog,deleteBlog
};
