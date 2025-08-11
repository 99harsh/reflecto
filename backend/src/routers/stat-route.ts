import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import { getDashboardCardDetails, getReflectionProgress, getTasksProgress, getXPStreakDetails } from '../controllers/stats-controller';


const router = Router();

router.get("/dashboard", verifyUserAuthToken, getDashboardCardDetails);
router.get("/progress", verifyUserAuthToken, getXPStreakDetails);
router.get("/self-reflection", verifyUserAuthToken, getReflectionProgress);
router.get("/tasks", verifyUserAuthToken, getTasksProgress);

export default router;