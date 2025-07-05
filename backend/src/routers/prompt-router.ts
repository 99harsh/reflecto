import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import { addUserPrompt, allPrompts, deleteUserPrompt, getUserPrompts } from '../controllers/prompt-controller';

const router = Router();

router.get("/all", verifyUserAuthToken, allPrompts);
router.get("/get", verifyUserAuthToken, getUserPrompts);
router.post("/add", verifyUserAuthToken, addUserPrompt);
router.post("/delete", verifyUserAuthToken, deleteUserPrompt);

export default router;