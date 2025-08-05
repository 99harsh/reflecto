import { Router } from "express";
import { authenticate } from "../controllers/auth-controller";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
const router = Router();

router.post('/authenticate', authenticate);
router.get('/profile', verifyUserAuthToken, (req:any, res)=>{
    res.json(req.payload)
});

export default router;