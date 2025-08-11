import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import {  getSelfReflection, saveSelfReflection } from "../controllers/self-reflection-controller";
const router = Router();

router.get("/get", verifyUserAuthToken, getSelfReflection);
router.post('/save', verifyUserAuthToken, saveSelfReflection);
export default router;