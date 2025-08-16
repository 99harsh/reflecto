import { Request, Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import prisma from '../utils/db';
import { formatNumberToShortForm } from "../utils/number-helper";
import { differenceInDays, endOfWeek, isSameDay, startOfWeek } from "date-fns";
import { all_activites, checkLevel, getSuccessRate, streak_activity_ids, xpInfo } from "../utils/stats-helper";
import { dateFilter } from "../utils/date-helper";
import { getDateInsightsSchema } from "../utils/validations";

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

            //Log in the user streak table for daily login
            await prisma.users_streak.create({
                data: {
                    user_id: req.payload.user_id,
                    streak_id: streak_activity_ids.daily_login,
                }
            })
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

export const getJournalProgress = async (req: any, res: Response) => {
    try {
        const totalJournalWords = await prisma.$queryRawUnsafe<{ totalWords: any; totalEntries: any; }[]>(`
        SELECT 
        CAST(SUM(CHAR_LENGTH(TRIM(journal)) - CHAR_LENGTH(REPLACE(TRIM(journal), ' ', '')) + 1) AS UNSIGNED) AS totalWords,
        CAST(COUNT(*) AS UNSIGNED) AS totalEntries
        FROM journals
        WHERE user_id = '${req.payload.user_id}' 
        AND journal IS NOT NULL 
        AND journal <> ''`);

        // Convert BigInt to Number or String
        let stats = { totalWords: 0, totalEntries: 0 };
        if (totalJournalWords.length) {
            stats.totalWords = typeof totalJournalWords[0].totalWords === 'bigint'
                ? Number(totalJournalWords[0].totalWords)
                : totalJournalWords[0].totalWords;
            stats.totalEntries = typeof totalJournalWords[0].totalEntries === 'bigint'
                ? Number(totalJournalWords[0].totalEntries)
                : totalJournalWords[0].totalEntries;
        }
        res.json(SUCCESS({
            totalEntries: formatNumberToShortForm(stats.totalEntries),
            totalWords: formatNumberToShortForm(stats.totalWords)
        }));
    } catch (error) {
        console.log(`JOURNAL INSIGHTS FAILED ${error}`);
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

export const getMoodProgress = async (req: any, res: Response) => {
    try {
        const now = new Date();

        // Get start and end of current week (Monday as first day)
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const moodData = await prisma.user_mood.findMany({
            where: {
                user_id: req.payload.user_id,
                updated_at: {
                    gte: weekStart,
                    lte: weekEnd
                },
            },
            select: {
                intensity: true,
                mood_id: true,
            },
        });
        // average intensity
        const avgIntensity =
            moodData.reduce((sum, item) => sum + item.intensity, 0) / moodData.length;

        // most common mood_id
        const moodFrequency: Record<number, number> = {};
        let mostCommonMood = 0;
        let maxCount = 0;

        for (const item of moodData) {
            moodFrequency[item.mood_id] = (moodFrequency[item.mood_id] || 0) + 1;

            if (moodFrequency[item.mood_id] > maxCount) {
                maxCount = moodFrequency[item.mood_id];
                mostCommonMood = item.mood_id;
            }
        }
        const moodNameEmoj = await prisma.all_moods.findUnique({where: {
            mood_id: mostCommonMood
        }})
        res.json(SUCCESS({
            avg_intensity: avgIntensity.toFixed(),
            most_common: `${moodNameEmoj?.mood_emoj} ${moodNameEmoj?.mood}`,
            mood_entries: moodData.length
        }));
    } catch (error) {
        console.log(`MOOD PROGRESS STATS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getCalendarData = async (req: any, res: Response) => {
    try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Step 1: Calculate start & end date for the 42-day calendar grid
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 41);

        // Step 2: Fetch all streak entries for the range
        const streak_data = await prisma.users_streak.findMany({
            where: {
                user_id: req.payload.user_id,
                logged_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        // Step 3: Build calendar array with flags
        const today = new Date();
        const calendarDays = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();

            // Get all entries for this date
            const entriesForDay = streak_data.filter(e =>
                new Date(e.logged_at).toDateString() === date.toDateString()
            );

            // Prepare flags based on streak_id presence
            const flags = {
                daily_login: entriesForDay.some(e => e.streak_id === streak_activity_ids.daily_login),
                self_reflection: entriesForDay.some(e => e.streak_id === streak_activity_ids.self_reflection),
                mood: entriesForDay.some(e => e.streak_id === streak_activity_ids.mood),
                journal: entriesForDay.some(e => e.streak_id === streak_activity_ids.journal),
                tasks: entriesForDay.some(e => e.streak_id === streak_activity_ids.tasks)
            };

            calendarDays.push({
                date: date.getDate(),
                fullDate: date,
                isCurrentMonth,
                isToday,
                ...flags
            });
        }

        // Step 4: Send ready-to-use calendar
        res.json(SUCCESS(calendarDays));

    } catch (error) {
        console.log(`GET CALENDAR FAILED ${error}`);
        res.json(ISE())
    }
}

export const getDateInsights = async (req: any, res: Response) => {
    try {
        const v_data = getDateInsightsSchema.safeParse(req.body);

        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }
        const mood_data = await prisma.user_mood.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(v_data.data.date)
            },
            select: {
                intensity: true
            }
        });

        const totalReflectionWords = await prisma.$queryRawUnsafe<{ totalWords: number }[]>(`
                        SELECT SUM(CHAR_LENGTH(TRIM(self_reflection)) - CHAR_LENGTH(REPLACE(TRIM(self_reflection), ' ', '')) + 1) AS totalWords
                        FROM self_reflection
                        WHERE user_id = '${req.payload.user_id}' AND self_reflection IS NOT NULL AND self_reflection <> ''
                        AND DATE(updated_at) = STR_TO_DATE('${v_data.data.date}', '%m-%d-%Y')
                        `);
        const totalJournalWords = await prisma.$queryRawUnsafe<{ totalWords: number }[]>(`
                        SELECT SUM(CHAR_LENGTH(TRIM(journal)) - CHAR_LENGTH(REPLACE(TRIM(journal), ' ', '')) + 1) AS totalWords
                        FROM journals
                        WHERE user_id = '${req.payload.user_id}' AND journal IS NOT NULL AND journal <> ''
                        AND DATE(updated_at) = STR_TO_DATE('${v_data.data.date}', '%m-%d-%Y')
                        `);
        const taskStats = await prisma.$queryRawUnsafe<{
            totalTasks: number | bigint;
            completedTasks: number | bigint;
        }[]>(`SELECT 
            COUNT(*) AS totalTasks,
            SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completedTasks
            FROM task
        WHERE user_id = '${req.payload.user_id}' 
        AND DATE(created_at) = STR_TO_DATE('${v_data.data.date}', '%m-%d-%Y')`);
        let totalTasks = taskStats[0]?.totalTasks ?? 0;
        let completedTasks = taskStats[0]?.completedTasks ?? 0;

        // Convert BigInt to Number if needed
        if (typeof totalTasks === 'bigint') totalTasks = Number(totalTasks);
        if (typeof completedTasks === 'bigint') completedTasks = Number(completedTasks);

        console.log({ totalTasks, completedTasks });

        res.json(SUCCESS({
            intensity: mood_data?.intensity || 0,
            journal: formatNumberToShortForm(totalJournalWords[0]?.totalWords) || 0,
            reflection: formatNumberToShortForm(totalReflectionWords[0]?.totalWords) || 0,
            total_tasks: totalTasks,
            completed_tasks: completedTasks
        }));

        res.json(SUCCESS({
            intensity: mood_data?.intensity || 0,
            journal: formatNumberToShortForm(totalJournalWords[0]?.totalWords) || 0,
            reflection: formatNumberToShortForm(totalReflectionWords[0]?.totalWords) || 0,
            total_tasks: taskStats[0]?.totalTasks || 0,
            completed_tasks: taskStats[0]?.completedTasks || 0
        }))

    } catch (error) {
        console.log(`GET DATE INSIGHT FAILED ${error}`, error);
        res.json(ISE());
    }
}

export const getMoodInsights = async (req: any, res: Response) => {
    try {
        const v_data = getDateInsightsSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        const mood_insights = await prisma.user_mood.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(v_data.data?.date),
                all_moods: {}
            },
            select: {
                mood_id: true,
                intensity: true,
                updated_at: true,
                all_moods: true
            }
        });
        const response = {
            intensity: mood_insights?.intensity,
            mood_emoj: mood_insights?.all_moods.mood_emoj,
            updated_at: mood_insights?.updated_at,
            mood_name: mood_insights?.all_moods.mood
        }
        res.json(SUCCESS(response));
    } catch (error) {
        console.log(`GET MOOD INSIGHTS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getJournalInsights = async (req: any, res: Response) => {
    try {
        const v_data = getDateInsightsSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        const journal_insights = await prisma.journals.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(v_data?.data?.date)
            },
            select: {
                journal: true,
                updated_at: true,
            }
        })

        res.json(SUCCESS(journal_insights));

    } catch (error) {
        console.log(`GET JOURNAL FAILED ${error}`);
        res.json(ISE());
    }
}

export const getSelfReflectionInsights = async (req: any, res: Response) => {
    try {
        const v_data = getDateInsightsSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        const self_reflection_insight = await prisma.self_reflection.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(v_data?.data?.date)
            }
        });

        res.json(SUCCESS(self_reflection_insight));
    } catch (error) {
        console.log(`SELF REFLECTION INSIGHTS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getTasksInsights = async (req: any, res: Response) => {
    try {
        const v_data = getDateInsightsSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }
        const task_insights = await prisma.task.findMany({
            where: {
                user_id: req.payload.user_id,
                created_at: dateFilter(v_data?.data.date)
            },
            select: {
                task: true,
                completed: true,
            }
        })

        res.json(SUCCESS(task_insights));
    } catch (error) {
        console.log(`TASKS INSIGHTS FAILED ${error}`);
        res.json(ISE());
    }
}

//select * from users order by xp desc limit 3;
//xp nikalo aur level check karo 
//display

// SELECT COUNT(*) AS totalTasks, SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completedTasks FROM task WHERE user_id = 1 AND DATE(created_at) = STR_TO_DATE('08-13-2025', '%m-%d-%Y')