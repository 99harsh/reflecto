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
import analyticsRoutes from './routers/analytics-router';
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1, // 1 minute
    max: 100, // limit each IP
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,  // disable `X-RateLimit-*` headers
  });

  app.use(limiter);

app.use(cors({
    origin: [
        "https://habitup.app",
        "https://habitup.inspex.dev",
        "http://localhost:4200",], // Replace with your Angular app's URL
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
app.use("/api/v1/analytics", analyticsRoutes);


const server = app.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING ON: ${process.env.PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:");
  console.error(err);
  process.exit(1); // optional: exit if critical
});
