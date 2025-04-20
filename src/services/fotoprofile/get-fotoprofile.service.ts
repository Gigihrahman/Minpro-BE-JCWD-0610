import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const getFotoProfileService = async (id: number) => {
  const user = await prisma.users.findFirst({
    where: {
      id: id,
    },
    select: {
      profilePicture: true,
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (!user.profilePicture) {
    throw new ApiError("Profile picture not found", 404);
  }

  return { profilePicture: user.profilePicture };
};
