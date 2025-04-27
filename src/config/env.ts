import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const DELAYED_JOB_WAIT_PAYMENT =
  Number(process.env.DELAYED_JOB_WAIT_PAYMENT) || 1; // 1 minute
export const DELAYED_JOB_WAIT_PAYMENT_CONFIRMATION =
  Number(process.env.DELAYED_JOB_WAIT_PAYMENT_CONFIRMATION) || 2;

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
