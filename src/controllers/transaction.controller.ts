import type { NextFunction, Request, Response } from "express";
import { getTransactionByuuidService } from "../services/transaction/get-transaction-by-uuid.service";
import { getTransactionsByUserService } from "../services/transaction/get-transaction-by-user";

export const getTransactionByuuidController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getTransactionByuuidService(req.params.uuid);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id4;
    const result = await getTransactionsByUserService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
