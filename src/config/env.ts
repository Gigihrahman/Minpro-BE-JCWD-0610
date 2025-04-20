import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_API_NAME = process.env.CLOUDINARY_API_NAME;
