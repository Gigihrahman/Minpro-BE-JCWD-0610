import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const getTransactionsByUserService = async (userId: number) => {
  const transactions = await prisma.transactions.findMany({
    where: {
      userId,
    },
  });
  if (!transactions) {
    throw new ApiError("Transaction not found", 404);
  }

  return transactions;
};
