import { DELAYED_JOB_WAIT_PAYMENT_CONFIRMATION } from "../../config/env";
import prisma from "../../config/prisma";
import { adminConfirmationQueue } from "../../jobs/queues/admin-confirmation.queue";
import { userTransactionQueue } from "../../jobs/queues/transaction.queue";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { ApiError } from "../../utils/api-error";

export const uploadTransactionsUploadProofService = async (
  uuid: string,
  userId: number,
  thumbnail: Express.Multer.File
) => {
  const result = prisma.$transaction(async (tx) => {
    const transactions = await tx.transactions.findFirst({
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
    const { secure_url } = await cloudinaryUpload(thumbnail);
    if (!secure_url) {
      throw new ApiError("Failed to upload proof payment", 500);
    }
    await tx.transactions.update({
      where: {
        id: transactions.id,
      },
      data: {
        status: "WAITING_FOR_ADMIN_CONFIRMATION",
      },
    });

    await tx.payments.create({
      data: {
        transactionId: transactions.id,
        paymentMethod: "TRANSFER",
        paymentProofUrl: secure_url,
      },
    });
    userTransactionQueue.remove(transactions.uuid);
    adminConfirmationQueue.add(
      "new-admin-confirmation",
      { uuid: transactions.uuid },
      {
        jobId: transactions.uuid,
        delay: DELAYED_JOB_WAIT_PAYMENT_CONFIRMATION * 60000, // 2 menit
        removeOnComplete: true,
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );
    return { message: "succesfully upload payment prooftment" };
  });

  return result;
};
