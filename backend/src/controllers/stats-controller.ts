import { Request, Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import prisma from '../utils/db';
import { formatNumberToShortForm } from "../utils/number-helper";
import { differenceInDays, endOfWeek, isSameDay, startOfWeek } from "date-fns";
import { all_activites, checkLevel, getSuccessRate, xpInfo } from "../utils/stats-helper";
import { dateFilter } from "../utils/date-helper";

export const getDashboardCardDetails = async (req: any, res: Response) => {
    try {
        if (!req.payload.user_id) {
            res.json(BADREQ());
            return;
        }
        const totalReflectionWords = await prisma.$queryRawUnsafe<{ totalWords: number }[]>(`
                        SELECT SUM(CHAR_LENGTH(TRIM(self_reflection)) - CHAR_LENGTH(REPLACE(TRIM(self_reflection), ' ', '')) + 1) AS totalWords
                        FROM self_reflection
                        WHERE user_id = '${req.payload.user_id}' AND self_reflection IS NOT NULL AND self_reflection <> ''
                        `);
        const totalJournalCount = await prisma.journals.count({
            where: { user_id: req.payload.user_id }
        });

        const totalMoodLoggedCount = await prisma.user_mood.count({
            where: { user_id: req.payload.user_id }
        })

        const totalTask = await prisma.task.findMany({
            where: { user_id: req.payload.user_id },
            select: { completed: true }
        });
        const totalTaskCount = formatNumberToShortForm(totalTask.length || 0)
        const completedTaskCount = formatNumberToShortForm((totalTask.filter((obj: any) => obj.completed))?.length || 0);

        let payload: any = {
            totalReflectionWords: 0,
            totalJournalCount,
            totalMoodLoggedCount,
            totalTaskCount,
            completedTaskCount
        };

        if (totalReflectionWords.length) {
            payload.totalReflectionWords = formatNumberToShortForm(totalReflectionWords[0].totalWords);
        }
        res.json(SUCCESS(payload));


    } catch (error) {
        console.log(`GET DASHBOARD CARD DETAILS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getXPStreakDetails = async (req: any, res: Response) => {
    try {
        let user_details = await prisma.users.findUnique({
            where: {
                user_id: req.payload.user_id
            }
        });

        if (!user_details) {
            res.json(SUCCESS({ message: "NO USER FOUND!" }));
            return;
        }
        const last_login = new Date(user_details.last_login).toLocaleString();
        const current_date = new Date().toLocaleString();
        let payload = {
            xp: user_details.xp,
            current_streak: user_details.current_streak,
            highest_streak: user_details.highest_streak,
        }
        if (differenceInDays(current_date, last_login) === 1) {
            payload.current_streak += 1;
        } else if (differenceInDays(current_date, last_login) > 1) {
            payload.current_streak = 1;
        }

        console.log(last_login, current_date)

        if (!isSameDay(last_login, current_date)) {
            if (payload.highest_streak === 0) {
                payload.highest_streak = payload.current_streak;
            } else if (payload.highest_streak < payload.current_streak) {
                payload.highest_streak = payload.current_streak
            }
            payload.xp = user_details.xp + xpInfo.dailyLogin;
            user_details = await prisma.users.update({
                data: payload,
                where: {
                    user_id: req.payload.user_id
                }
            });
        }

        const levelInfo = checkLevel(user_details.xp);

        const journal = await prisma.journals.count({
            where: { updated_at: dateFilter() }
        });

        const reflection = await prisma.self_reflection.count({
            where: {
                updated_at: dateFilter()
            }
        });

        const tasks = await prisma.task.count({
            where: {
                created_at: dateFilter()
            }
        });

        const user_mood = await prisma.user_mood.count({
            where: {
                updated_at: dateFilter()
            }
        });

        const activity_xp = all_activites;

        activity_xp[0].is_completed = isSameDay(last_login, current_date) ? 1 : 0;
        activity_xp[1].is_completed = reflection;
        activity_xp[2].is_completed = user_mood;
        activity_xp[3].is_completed = journal;
        activity_xp[4].is_completed = tasks;

        res.json(SUCCESS({
            xp: user_details.xp,
            current_streak: user_details.current_streak,
            highest_streak: user_details.highest_streak,
            current_level: levelInfo.currentLevel,
            xp_next_level: levelInfo.nextLevelXP,
            progress: levelInfo.progress,
            all_activites: activity_xp,
        }));

    } catch (error) {
        console.log(`GET XP STREAK DETAILS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getReflectionProgress = async (req: any, res: Response) => {
    try {
        const totalReflectionStats = await prisma.$queryRawUnsafe<{ totalWords: any; totalEntries: any; }[]>(`
        SELECT 
        CAST(SUM(CHAR_LENGTH(TRIM(self_reflection)) - CHAR_LENGTH(REPLACE(TRIM(self_reflection), ' ', '')) + 1) AS UNSIGNED) AS totalWords,
        CAST(COUNT(*) AS UNSIGNED) AS totalEntries
        FROM self_reflection
        WHERE user_id = '${req.payload.user_id}' 
        AND self_reflection IS NOT NULL 
        AND self_reflection <> ''`);

        // Convert BigInt to Number or String
        let stats = { totalWords: 0, totalEntries: 0 };
        if (totalReflectionStats.length) {
            stats.totalWords = typeof totalReflectionStats[0].totalWords === 'bigint'
                ? Number(totalReflectionStats[0].totalWords)
                : totalReflectionStats[0].totalWords;
            stats.totalEntries = typeof totalReflectionStats[0].totalEntries === 'bigint'
                ? Number(totalReflectionStats[0].totalEntries)
                : totalReflectionStats[0].totalEntries;
        }
        res.json(SUCCESS({
            totalEntries: formatNumberToShortForm(stats.totalEntries),
            totalWords: formatNumberToShortForm(stats.totalWords)
        }));
    } catch (error) {
        console.log(`REFLECTION PROGRESS STATS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getTasksProgress = async (req: any, res: Response) => {
    try {
        const now = new Date();

        // Get start and end of current week (Monday as first day)
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const tasks = await prisma.task.findMany({
            where: {
                user_id: req.payload.user_id,
                created_at: {
                    gte: weekStart,
                    lte: weekEnd
                }
            },
            select: {
                completed: true
            }
        });

        const payload: any = {
            total_tasks: tasks.length,
            completed_tasks: 0,
            success_rate: 0
        };

        payload.completed_tasks = tasks.filter((obj: any) => obj.completed).length;
        payload.success_rate = getSuccessRate(payload.completed_tasks, payload.total_tasks);

        res.json(SUCCESS(payload));

    } catch (error) {
        console.log(`TASK PROGRESS STATS FAILED ${error}`);
        res.json(ISE());
    }
}

//select * from users order by xp desc limit 3;
//xp nikalo aur level check karo 
//display