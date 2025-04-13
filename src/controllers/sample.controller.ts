import type { NextFunction, Request, Response } from "express";
import { getSampleService } from "../services/sample/get-sample.service";

export const getSampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getSampleService();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
