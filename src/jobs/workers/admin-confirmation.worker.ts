import { Worker } from "bullmq";
import { redisConnection } from "../../lib/redis";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const adminConfirmationWorker = new Worker(
  "admin-confirmation-queue",
  async (job) => {
    const uuid = job.data.uuid;
    const transaction = await prisma.transactions.findFirst({
      where: { uuid },
    });
    if (!transaction) throw new ApiError("invalid transaction uuid", 400);
    if (transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION") {
      await prisma.$transaction(async (tx) => {
        await tx.transactions.update({
          where: { uuid },
          data: {
            status: "CANCELED",
          },
        });
        const transactionItems = await tx.detailTransaction.findMany({
          where: { transactionId: transaction.id },
          select: { seatsId: true, quantity: true },
        });

        for (const item of transactionItems) {
          await tx.seats.update({
            where: { id: item.seatsId },
            data: {
              reserved: { decrement: item.quantity },
            },
          });
        }
      });
    }
  },
  { connection: redisConnection }
);
