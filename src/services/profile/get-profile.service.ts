import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const getProfileService = async (id: number) => {
  const profile = await prisma.users.findFirst({
    where: { id: Number(id), deletedAt: null },
  });
  if (!profile) {
    throw new ApiError("Profile not found", 404);
  }
  return profile;
};
