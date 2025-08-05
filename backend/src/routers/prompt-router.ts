import { Router } from 'express';
import { verifyUserAuthToken } from '../middlewares/auth-middleware';
import {allPrompts,  } from '../controllers/prompt-controller';

const router = Router();

router.get("/all", verifyUserAuthToken, allPrompts);

export default router;