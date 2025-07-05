import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { createSelfReflection, getSelfReflection, updateSelfReflection } from "../controllers/self-reflection-controller";
const router = Router();

router.get("/get", verifyUserAuthToken, getSelfReflection);
router.post("/add", verifyUserAuthToken, createSelfReflection);
router.post("/update", verifyUserAuthToken, updateSelfReflection);

export default router;