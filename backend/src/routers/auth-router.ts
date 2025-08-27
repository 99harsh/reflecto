import { Router } from "express";
import { authenticate, logout, profile } from "../controllers/auth-controller";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
const router = Router();

router.post('/authenticate', authenticate);
router.get("/logout", verifyUserAuthToken, logout)
router.get('/profile', verifyUserAuthToken, profile);

export default router;