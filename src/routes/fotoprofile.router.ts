import { Router } from "express";
import {
  getFotoProfileController,
  updateFotoProfileController,
} from "../controllers/fotoprofile.controller";

const router = Router();

router.get("/:id", getFotoProfileController);
router.patch("/:id", updateFotoProfileController);

export default router;
