import { Router } from "express";
import { mixpanel } from "../utils/mixpanel";
import { verifyUserAuthToken } from "../middlewares/auth-middleware";
import { SUCCESS } from "../utils/responses";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post("/track", verifyUserAuthToken, (req:any, res) => {
    const { event, properties } = req.body;
    const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress;
    console.log("ip", ip);
    mixpanel.track(event, {
        distinct_id: req.payload.user_id,
        server_ts: new Date().toLocaleDateString(),
        ip, 
        ...(properties || {})
    });
    

    res.json(SUCCESS());
    return;
});

router.post("/track-landing", (req, res) => {
    const { event } = req.body;
    const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress;
    console.log("ip", ip);
    mixpanel.track(event, {
        distinct_id:    uuidv4(),
        server_ts: new Date().toLocaleDateString(),
        ip, 
    });
    

    res.json(SUCCESS());
    return;
})
export default router;