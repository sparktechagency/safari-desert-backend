/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";

import auth from "../../app/middleware/auth";

import { USER_ROLE } from "../Auth/auth.constant";

import { upload } from "../../app/middleware/upload";
import { PackageControllers } from "./package.controller";
import { createPackage } from "./package.validation";
import validateRequest from "../../app/middleware/validateRequest";

const router = express.Router();

// router.post(
//   "/create-package",
//   upload.array("image"),
//   (req: Request, res: Response, next: NextFunction) => {
//     // console.log("req data--->",req.body.data);
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data);
//     }
//     next();
//   },

//   auth(USER_ROLE.superAdmin),
//   validateRequest(createPackage),
//   PackageControllers.createPackage
// );

router.post(
  "/create-package",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "image", maxCount: 12 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  auth(USER_ROLE.superAdmin),
  validateRequest(createPackage),
  PackageControllers.createPackage
);



router.get("/allPackage", PackageControllers.getAllPackage);

router.get("/single-package/:id", PackageControllers.getSinglePackage);

router.delete("/delete-package/:id", PackageControllers.deletePackage);

router.patch('/update-package/:id',
      upload.array("images"),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req data--->",req.body.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },

  auth(USER_ROLE.superAdmin),
    PackageControllers.updatePackage)

router.post('/checkout',PackageControllers.initiateOrderPayment)



export const PackageRoutes = router;
