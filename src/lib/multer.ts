import multer from "multer";

export const uplouder = (fileLimit: number = 2) => {
  const storage = multer.memoryStorage();

  const limits = { fileSize: fileLimit * 1024 * 1024 }; // default 2MB

  return multer({ storage, limits });
};
