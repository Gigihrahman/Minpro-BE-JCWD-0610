import type { NextFunction, Request, Response } from "express";
import { getTransactionByuuidService } from "../services/transaction/get-transaction-by-uuid.service";
import { getTransactionsByUserService } from "../services/transaction/get-transaction-by-user";
import { uploadTransactionsUploadProofService } from "../services/transaction/upload-proof-transaction.service";
import { createTransactionService } from "./../services/transaction/create-transaction.service";

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

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //ini harus diubah dengan token dari token jwt
    const { userId } = req.params;
    const result = await createTransactionService(Number(userId), req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const uploadTransactionsUploadProofController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //ini harus diubah dengan token dari token jwt
    const { uuid } = req.params;
    const { userId } = req.query;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const thumbnail = files.thumbnail?.[0];
    const result = await uploadTransactionsUploadProofService(
      uuid,
      Number(userId),
      thumbnail
    );
  } catch (error) {
    next(error);
  }
};
