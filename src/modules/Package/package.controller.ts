import { NextFunction, Request, Response } from 'express';



import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PackageServices } from './package.services';




const getAllPackage = catchAsync(async(req:Request,res:Response)=>{

  const result = await PackageServices.getAllPackageFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Package retrived succesfully!',
      data: result,
    });

})
const getSinglePackage= catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await PackageServices.getSinglePackageFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Package retrived succesfully!',
      data: result,
    });

})


const createPackage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
//   const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;

 const filesArr = (req.files as Express.Multer.File[]) || [];
    const single = (req.file as Express.Multer.File) || undefined;
    const uploaded = filesArr.length ? filesArr : (single ? [single] : []);

    // Normalize body
    const body: any = req.body || {};

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uploadedUrls = uploaded.map(
      (f) => `${baseUrl}/uploads/${f.filename}`
    );

      const bodyImages: string[] = Array.isArray(body.image_multi)
      ? body.image_multi
      : (typeof body.image_multi === "string" && body.image_multi
          ? [body.image_multi]
          : []);

    // Merge + clean (trim, dedupe, truthy only)
    const image_multi = Array.from(
      new Set([...bodyImages, ...uploadedUrls].map((s) => String(s).trim()).filter(Boolean))
    );
const payload = req.body
payload.images = image_multi
payload.user = req?.user?.userId
  try {
    const result = await PackageServices.addPackageIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Package Created Successfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PackageServices.deletePackageFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Package deleted successfully!',
    data: result,
  });
})
const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

const filesArr = (req.files as Express.Multer.File[]) || [];
    const single = (req.file as Express.Multer.File) || undefined;
    const uploaded = filesArr.length ? filesArr : (single ? [single] : []);

    // Normalize body
    const body: any = req.body || {};
    
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const uploadedUrls = uploaded.map(
      (f) => `${baseUrl}/uploads/${f.filename}`
    );

      const bodyImages: string[] = Array.isArray(body.image_multi)
      ? body.image_multi
      : (typeof body.image_multi === "string" && body.image_multi
          ? [body.image_multi]
          : []);

    // Merge + clean (trim, dedupe, truthy only)
    const image_multi = Array.from(
      new Set([...bodyImages, ...uploadedUrls].map((s) => String(s).trim()).filter(Boolean))
    );
const payload = req.body
payload.images = image_multi
payload.user = req?.user?.userId
  const result = await PackageServices.updatePackageFromDB(id,payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Package Updated successfully!',
    data: result,
  });
})



export const PackageControllers = {
deletePackage,createPackage,getAllPackage,getSinglePackage,updatePackage
};
