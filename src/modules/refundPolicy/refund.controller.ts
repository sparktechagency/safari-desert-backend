import { Request, Response } from 'express';

import AppError from '../../errors/AppError';

import httpStatus from 'http-status';


import Terms from './refund.model';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';


// Controller to create or update Privacy Policy content
const createOrUpdateTerms = catchAsync(async (req: Request, res: Response) => {
  const { refundPolicy } = req.body;

  // Check if Privacy Policy exists; if it does, update, otherwise create
  const existingTerms = await Terms.findOne();

  if (existingTerms) {
    // Update the existing Privacy Policy record
    const updatedPrivacyPolicy = await Terms.updateOne(
      { _id: existingTerms._id },
      { refundPolicy },
      { runValidators: true },
    );

    if (!updatedPrivacyPolicy.modifiedCount) {
      throw new AppError(httpStatus.BAD_REQUEST,('Failed to update refund policy'));
    }

   return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refund policy created successfully',
      data: updatedPrivacyPolicy,
    }); 
  } else {
    // Create a new Privacy Policy record
    const newTerms = await Terms.create({ refundPolicy });

    if (!newTerms) {
    throw new AppError(httpStatus.BAD_REQUEST,('Failed to Refund'));
    }

   return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refund policy created successfully',
      data: newTerms,
    });
  }
});

// Controller to get Privacy Policy content
const getTerms = catchAsync(async (req: Request, res: Response) => {
  const terms = await Terms.findOne();

  if (!terms) {
     throw new AppError(httpStatus.NOT_FOUND,('No About us!'));

  }

   return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refund Policy retrived successfully',
      data: terms,
    });
});

export default {
  createOrUpdateTerms,
  getTerms,
};