import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import { getCalendarData, getDashboardCardDetails, getDateInsights, getJournalInsights, getJournalProgress, getMoodInsights, getMoodProgress, getReflectionProgress, getSelfReflectionInsights, getTasksInsights, getTasksProgress, getXPStreakDetails } from '../controllers/stats-controller';

const router = Router();

router.get("/dashboard", verifyUserAuthToken, getDashboardCardDetails);
router.get("/progress", verifyUserAuthToken, getXPStreakDetails);
router.get("/self-reflection", verifyUserAuthToken, getReflectionProgress);
router.get("/journal", verifyUserAuthToken, getJournalProgress)
router.get("/tasks", verifyUserAuthToken, getTasksProgress);
router.get("/calendar", verifyUserAuthToken, getCalendarData);
router.get("/mood", verifyUserAuthToken, getMoodProgress);

router.post("/date-insights", verifyUserAuthToken, getDateInsights);
router.post("/mood-insights", verifyUserAuthToken, getMoodInsights);
router.post("/journal-insights", verifyUserAuthToken, getJournalInsights);
router.post("/self-reflection-insights", verifyUserAuthToken, getSelfReflectionInsights);
router.post("/task-insights", verifyUserAuthToken, getTasksInsights);
export default router;