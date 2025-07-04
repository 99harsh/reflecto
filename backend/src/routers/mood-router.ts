import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import { createMood, getMood, updateMood } from '../controllers/mood-controller';

const router = Router();

router.get("/get", verifyUserAuthToken, getMood);
router.post("/add", verifyUserAuthToken, createMood);
router.post("/update", verifyUserAuthToken, updateMood);

export default router;