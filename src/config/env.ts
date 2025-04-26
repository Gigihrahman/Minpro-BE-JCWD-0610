import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const DELAYED_JOB = Number(process.env.DELAYED_JOB) || 1; // 1 minute
