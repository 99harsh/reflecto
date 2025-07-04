import { Router } from "express";
import { authenticate } from "../controllers/auth-controller";
const router = Router();

router.post('/authenticate', authenticate);

export default router;