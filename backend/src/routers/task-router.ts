import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { addTask, deleteTask, getTasks } from "../controllers/task-controller";

const router = Router();

router.get("/get", verifyUserAuthToken, getTasks);
router.post("/add", verifyUserAuthToken, addTask);
router.post("/delete", verifyUserAuthToken, deleteTask)

export default router;