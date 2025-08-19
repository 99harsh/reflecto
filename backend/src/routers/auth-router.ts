import { Router } from "express";
import { authenticate, logout } from "../controllers/auth-controller";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
const router = Router();

router.post('/authenticate', authenticate);
router.get("/logout", verifyUserAuthToken, logout)
router.get('/profile', verifyUserAuthToken, (req:any, res)=>{
    res.json(req.payload)
});

export default router;