import { Router } from "express";
import { uploader } from "../lib/multer";

const router = Router();
router.post("/", uploader().fields([{ name: "thumbnail", maxCount: 1 }]));
export default router;
