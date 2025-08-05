import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import { allMoods, getMood, logMood } from '../controllers/mood-controller';

const router = Router();

router.get("/all", verifyUserAuthToken, allMoods);
router.get("/get", verifyUserAuthToken, getMood);
router.post("/log", verifyUserAuthToken, logMood);
export default router;