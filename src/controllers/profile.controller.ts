import type { NextFunction, Request, Response } from "express";
import { getProfileService } from "../services/profile/get-profile.service";
import { updateProfileService } from "../services/profile/update-profile.service";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await getProfileService(Number(id));
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await updateProfileService(req.params.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
