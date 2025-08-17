import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { getProfileData, resetProfileData } from "../controllers/profile-controller";

const router = Router();

router.get("/details", verifyUserAuthToken, getProfileData);
router.get("/reset", verifyUserAuthToken, resetProfileData)

export default router;