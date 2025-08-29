import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import {allPrompts, insertPrompts,  } from '../controllers/prompt-controller';

const router = Router();

router.get("/all", verifyUserAuthToken, allPrompts);
router.post("/add", verifyUserAuthToken, insertPrompts);
export default router;