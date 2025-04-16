import { Users } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { hashPassword } from "../../lib/argon";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

interface RegisterPayload extends Users {
  referralCodeUsed?: string;
}
export const registerService = async (body: RegisterPayload) => {
  
  const existingEmail = await prisma.users.findFirst({
    where: { email: body.email },
  });

  if (existingEmail) {
    throw new ApiError("Email already exists", 400);
  }

  const hashedPassword = await hashPassword(body.password);

  const referralCode = nanoid(10);

  const result = await prisma.$transaction(async (tx) => {
    let newUser;

    if (body.referralCodeUsed) {
      const refererUser = await tx.users.findFirst({
        where: { referalCode: body.referralCodeUsed },
      });

      if (!refererUser) {
        throw new ApiError("Referral code is invalid", 400);
      }

      newUser = await tx.users.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
          phoneNumber: body.phoneNumber,
          profilePicture: body.profilePicture,
          role: body.role ?? "USER",
          referalCode: referralCode,
        },
      });

      await tx.referrals.create({
        data: {
          refererUserId: refererUser.id,
          referredUserId: newUser.id,
          expiredAt: dayjs().add(3, "months").toDate(),
        },
      });
    } else {
      newUser = await tx.users.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
          phoneNumber: body.phoneNumber,
          profilePicture: body.profilePicture,
          role: body.role ?? "USER",
          referalCode: referralCode,
        },
      });
    }

    const { password, referalCode, deletedAt, ...safeResult } = newUser;
    return safeResult;
  });

  return result;
};
