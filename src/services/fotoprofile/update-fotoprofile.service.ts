import prisma from "../../config/prisma";
import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import { ApiError } from "../../utils/api-error";

export const updateFotoProfileService = async (
  id: number,
  file: Express.Multer.File
) => {
  // 1. Cari user
  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // 2. Jika user punya foto sebelumnya, hapus dari cloudinary
  if (user.profilePicture) {
    await cloudinaryRemove(user.profilePicture);
  }

  // 3. Upload file ke Cloudinary
  const result = await cloudinaryUpload(file);

  // 4. Simpan URL baru ke DB
  const updatedUser = await prisma.users.update({
    where: { id },
    data: {
      profilePicture: result.secure_url,
    },
    select: {
      id: true,
      profilePicture: true,
    },
  });

  return updatedUser;
};
