import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { getJournal, saveJournal } from "../controllers/journal-controller";
const router = Router();

router.get("/get", verifyUserAuthToken, getJournal);
router.post("/save", verifyUserAuthToken, saveJournal);

export default router;