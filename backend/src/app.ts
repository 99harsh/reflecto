import express from 'express';
import dotenv from 'dotenv';
import session from "express-session";
import cors from 'cors';
import cookieParse from 'cookie-parser';
import authRoute from './routers/auth-router';
import taskRoute from './routers/task-router';
import journalRoute from './routers/journal-router';
import moodRouter from './routers/mood-router';

dotenv.config();
const app = express();

app.use(cors({
    origin: ["http://localhost:4200"],
    credentials: true
}));

app.use(cookieParse());
app.use(express.json());
app.use(session({
    secret: process.env.AUTH_SECRET || "KEREzaman@123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true } // Set secure to true in production (with HTTPS)
}));

app.get("/health", (req, res) => { 
    res.json({ status: 200 })
 })

 app.use("/api/v1/auth", authRoute);
 app.use("/api/v1/task", taskRoute);
 app.use("/api/v1/journal", journalRoute);
 app.use("/api/v1/mood", moodRouter);

app.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING ON: ${process.env.PORT}`);
})