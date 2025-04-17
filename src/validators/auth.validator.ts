import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/api-error";

export const validateLogin = [
  body("email").notEmpty().withMessage("Email is required").isEmail(),
  body("password").notEmpty().withMessage("Password is required").isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ApiError(errors.array()[0].msg, 400);
    }
    next();
  },
];