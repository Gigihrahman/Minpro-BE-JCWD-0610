import multer from "multer";

export const uploader = (fileLimit: number = 2) => {
  const storage = multer.memoryStorage();
  const limits = { fileSize: fileLimit * 1024 * 1024 }; //default 2 MB
  return multer({ storage, limits });
};
