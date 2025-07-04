import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { addJournal, getJournal, updateJournal } from "../controllers/journal-controller";
const router = Router();

router.get("/get", verifyUserAuthToken, getJournal);
router.post("/add", verifyUserAuthToken,addJournal);
router.post("/update", verifyUserAuthToken, updateJournal);

export default router;