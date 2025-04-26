import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const uploadTransactionsUploadProofService = async (
  uuid: string,
  userId: number
) => {
  const transactions = await prisma.transactions.findFirst({
    where: {
      uuid,
    },
  });
  if (!transactions) {
    throw new ApiError("Transaction not found", 404);
  }
  if (transactions.userId !== userId) {
    throw new ApiError(
      "You are not authorized to upload proof for this transaction",
      403
    );
  }

  return transactions;
};
