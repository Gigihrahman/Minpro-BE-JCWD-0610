import { Router } from "express";
import {
  getProfileController,
  updateProfileController,
} from "../controllers/profile.controller";

const router = Router();

router.get("/:id", getProfileController);
router.patch("/:id", updateProfileController);

export default router;
