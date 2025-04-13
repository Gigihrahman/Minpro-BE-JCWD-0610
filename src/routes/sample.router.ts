import { Router } from "express";
import { getSampleController } from "../controllers/sample.controller";

const router = Router();
router.get("/", getSampleController);
export default router;
