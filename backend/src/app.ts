import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import authRoute from './routers/auth-router';
import taskRoute from './routers/task-router';
import journalRoute from './routers/journal-router';
import moodRouter from './routers/mood-router';
import promptRouter from './routers/prompt-router';
import statsRouter from './routers/stat-route';
import selfReflectionRouter from './routers/self-reflection-router';
import profileRouter from './routers/profile-router';

dotenv.config();
const app = express();

app.use(cors({
    origin: ["http://localhost:3000",
        "https://habitup.inspex.dev",
        "https://api-habitup.inspex.dev",
        "http://localhost:4200",
        "http://localhost:4400",
        "http://localhost:4000",
        "http://192.168.0.227:4200",
        "http://192.168.0.147:4200",
        "http://192.168.0.147:4000",
        "http://192.168.0.214:4200",
        "http://192.168.0.195:4000",
        "http://192.168.0.195:3000",
        "http://192.168.0.195"], // Replace with your Angular app's URL
    credentials: true
}));

app.use(cookieParse());
app.use(express.json());

app.set('trust proxy', 1);
app.get("/health", (req, res) => {
    res.json({ status: 200 })
})

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/task", taskRoute);
app.use("/api/v1/journal", journalRoute);
app.use("/api/v1/mood", moodRouter);
app.use("/api/v1/prompt", promptRouter);
app.use("/api/v1/self-reflection", selfReflectionRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/profile", profileRouter);


app.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING ON: ${process.env.PORT}`);
})