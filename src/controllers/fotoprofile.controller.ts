import { NextFunction, Request, Response } from "express";
import { getFotoProfileService } from "../services/fotoprofile/get-fotoprofile.service";
import { updateFotoProfileService } from "../services/fotoprofile/update-fotoprofile.service";

export const getFotoProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await getFotoProfileService(Number(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateFotoProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const file = req.file as Express.Multer.File;
  
      if (!file) {
        throw new Error("No file uploaded");
      }
  
      const result = await updateFotoProfileService(id, file);
  
      res.status(200).json({
        message: "Profile picture updated successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };