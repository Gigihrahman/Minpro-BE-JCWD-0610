import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const getTransactionByuuidService = async (uuid: string) => {
  const transaction = await prisma.transactions.findFirst({
    where: {
      uuid: uuid,
    },
    include: {
      detailTransaction: true,
    },
  });
  if (!transaction) {
    throw new ApiError("Transaction not found", 404);
  }

  return transaction;
};
