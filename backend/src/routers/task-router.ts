import { Router } from "express";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { addTask, deleteTask, getTasks, updateTask } from "../controllers/task-controller";

const router = Router();

router.get("/get", verifyUserAuthToken, getTasks);
router.post("/add", verifyUserAuthToken, addTask);
router.post("/delete", verifyUserAuthToken, deleteTask);
router.post("/update", verifyUserAuthToken, updateTask)

export default router;