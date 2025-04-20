import { Users } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const updateProfileService = async (
  id: string,
  body: Partial<Users>
) => {
  const profile = await prisma.users.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!profile) {
    throw new ApiError("Profile not found", 404);
  }
  if (body.email) {
    const existingEmail = await prisma.users.findFirst({
      where: { email: body.email },
    });
    if (existingEmail) {
      throw new ApiError("Email already exist!", 400);
    }
  }
  const updatedUser = await prisma.users.update({
    where: { id: Number(id) },
    data: body,
  });

  const { password, ...updateUserWithoutPassword } = updatedUser;

  return updateUserWithoutPassword;
};
