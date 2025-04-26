import type {
  Coupons,
  DetailTransaction,
  Seats,
  Transactions,
  Vouchers,
} from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { userTransactionQueue } from "../../jobs/queues/transaction.queue";
import { DELAYED_JOB } from "../../config/env";

interface TransactionItem {
  id: number;
  quantity: number;
}
interface CreateTransaction {
  coupon?: string;
  voucher?: string;
  points?: boolean;
  transactionItem: TransactionItem[];
}

interface CreateDetailTransaction {
  seatId: number;
  quantity: number;
  price: number;
}
export const createTransactionService = async (
  userId: number,
  body: CreateTransaction
) => {
  const { transactionItem } = body;
  let { coupon, voucher, points } = body;

  let existingCoupon: Coupons | null = null;
  let existingVoucher: Vouchers | null = null;
  let existingPoint: number | null = null;
  let originalPrice: number = 0;

  if (transactionItem.length === 0) {
    throw new ApiError("Please input your transaction items", 400);
  }

  prisma.$transaction(async (tx) => {
    if (coupon) {
      const couponTrimmed = validateEmptyCode(coupon);
      if (!couponTrimmed) {
        return;
      }
      const existCoupon = await tx.coupons.findFirst({
        where: {
          couponCode: couponTrimmed,
          isUsed: false,
        },
      });

      if (!existCoupon) {
        throw new ApiError("Coupon not found or used", 404);
      }
      if (existCoupon.isExpired) {
        throw new ApiError("Coupon is Expired", 404);
      }
      if (originalPrice - existCoupon.discount <= 0) {
        throw new ApiError("Coupon discount is greater than total price", 404);
      }
      tx.coupons.update({
        where: { id: existCoupon.id },
        data: { isUsed: true },
      });
      existingCoupon = { ...existCoupon };
    }
    if (voucher) {
      const voucherTrimmed = validateEmptyCode(voucher);
      if (!voucherTrimmed) {
        return;
      }
      const foundVoucher = await tx.vouchers.findFirst({
        where: { voucherCode: voucher },
      });

      if (!foundVoucher) {
        throw new ApiError("Voucher not found", 404);
      }
      if (foundVoucher.validAt > new Date()) {
        throw new ApiError("Voucher is not yet valid", 404);
      }
      if (foundVoucher.expiredAt < new Date()) {
        throw new ApiError("voucher expired", 404);
      }
      if (foundVoucher.claimed >= foundVoucher.quota) {
        throw new ApiError("Voucher limit reached", 404);
      }
      await tx.vouchers.update({
        where: { id: foundVoucher.id },
        data: { claimed: { increment: 1 } },
      });
      existingVoucher = { ...foundVoucher };
    }

    if (points) {
      const foundPoint = await tx.points.findFirst({
        where: { userId },
      });
      if (!foundPoint) {
        throw new ApiError("you dont have point", 404);
      }
      if (foundPoint.pointsValue === 0) {
        throw new ApiError("your point 0", 404);
      }

      existingPoint = foundPoint.pointsValue;
    }
    const seatArray: CreateDetailTransaction[] = [];
    await Promise.all(
      transactionItem.map(async (item) => {
        const seat = await tx.seats.findFirst({
          where: { id: item.id },
          include: { event: true },
        });

        if (!seat) {
          throw new ApiError("Product not found", 404);
        }

        if (seat.event.startEvent <= new Date()) {
          throw new ApiError("Event already started", 404);
        }
        if (seat.reserved + item.quantity >= seat.totalSeat) {
          throw new ApiError("Product out of stock", 404);
        }
        if (seat.eventId !== existingVoucher?.eventId) {
          throw new ApiError(
            `${seat.name} cannot using this voucher code for this event`,
            404
          );
        }
        seatArray.push({
          price: seat.price,
          quantity: item.quantity,
          seatId: seat.id,
        });
        originalPrice += seat.price * item.quantity;
      })
    );

    const priceAfterDisc =
      originalPrice -
      ((existingVoucher?.value || 0) + (existingCoupon?.discount || 0));

    //ini kondisi dimana tidak ada coupon dan voucher
    if (!existingVoucher && !existingCoupon && !existingPoint) {
      const transaction = await tx.transactions.create({
        data: {
          userId,
          totalPrice: originalPrice,
        },
      });

      const detaiTransaction = await tx.detailTransaction.createMany({
        data: seatArray.map((item) => {
          return {
            transactionId: transaction.id,
            seatsId: item.seatId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          };
        }),
      });

      if (detaiTransaction) {
        await userTransactionQueue.add(
          "new-transaction",
          { uuid: transaction.uuid },
          {
            jobId: transaction.uuid,
            delay: DELAYED_JOB * 60000, // 2 menit
            removeOnComplete: true,
            attempts: 5,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          }
        );
      }
    }
    //ini kondisi dimana coucher dan coupondihitung besamaan
    if (priceAfterDisc <= 0) {
      const transaction = await tx.transactions.create({
        data: {
          userId,
          couponId: existingCoupon?.id || null,
          coupoun_amount: existingCoupon?.discount || 0,
          voucherId: existingVoucher?.id || null,
          voucher_amount: existingVoucher?.value || 0,
          totalPrice: 0,
        },
      });

      const detaiTransaction = await tx.detailTransaction.createMany({
        data: seatArray.map((item) => {
          return {
            transactionId: transaction.id,
            seatsId: item.seatId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          };
        }),
      });

      if (detaiTransaction) {
        await userTransactionQueue.add(
          "new-transaction",
          { uuid: transaction.uuid },
          {
            jobId: transaction.uuid,
            delay: DELAYED_JOB * 60000, // 2 menit
            removeOnComplete: true,
            attempts: 5,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          }
        );
      }
      return {
        message: "Transaction created successfully",
      };
    }
    //ini kondisi dimana point ada
    let priceAfterPoints = 0;
    if (existingPoint || 0 > priceAfterDisc) {
      const transaction = await tx.transactions.create({
        data: {
          userId,
          couponId: existingCoupon?.id,
          coupoun_amount: existingCoupon?.discount || 0,
          voucherId: existingVoucher?.id,
          voucher_amount: existingVoucher?.value || 0,
          usedPoint: existingPoint ? existingPoint : 0,
          totalPrice: 0,
        },
      });

      await tx.points.update({
        where: {
          userId: userId,
        },
        data: {
          pointsValue: { decrement: existingPoint || 0 - priceAfterDisc },
        },
      });

      const detaiTransaction = await tx.detailTransaction.createMany({
        data: seatArray.map((item) => {
          return {
            transactionId: transaction.id,
            seatsId: item.seatId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          };
        }),
      });

      if (detaiTransaction) {
        await userTransactionQueue.add(
          "new-transaction",
          { uuid: transaction.uuid },
          {
            jobId: transaction.uuid,
            delay: DELAYED_JOB * 60000, // 2 menit
            removeOnComplete: true,
            attempts: 5,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          }
        );
      }

      return {
        message: "Transaction created successfully",
      };
    } else {
      priceAfterPoints = priceAfterDisc - (existingPoint || 0);
    }

    const transaction = await tx.transactions.create({
      data: {
        userId,
        couponId: existingCoupon?.id,
        coupoun_amount: existingCoupon?.discount || 0,
        voucherId: existingVoucher?.id,
        voucher_amount: existingVoucher?.value || 0,
        usedPoint: existingPoint ? existingPoint : 0,
        totalPrice: priceAfterPoints,
      },
    });

    await tx.points.update({
      where: {
        userId,
      },
      data: {
        pointsValue: 0,
      },
    });

    const detaiTransaction = await tx.detailTransaction.createMany({
      data: seatArray.map((item) => {
        return {
          transactionId: transaction.id,
          seatsId: item.seatId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        };
      }),
    });

    if (detaiTransaction) {
      await userTransactionQueue.add(
        "new-transaction",
        { uuid: transaction.uuid },
        {
          jobId: transaction.uuid,
          delay: DELAYED_JOB * 60000, // 2 menit
          removeOnComplete: true,
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        }
      );
    }

    return {
      message: "Transaction created successfully",
    };
  });
};
