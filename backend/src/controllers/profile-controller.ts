import { Response } from 'express';
import { ISE, SUCCESS } from '../utils/responses';
import prisma from '../utils/db';
import { checkLevel } from '../utils/stats-helper';

export const getProfileData = async (req: any, res: Response) => {
    try {
        let profileData: any = await prisma.users.findMany({
            select: {
                name: true,
                xp: true,
                user_id: true
            },
            orderBy: {
                xp: 'desc'
            },
            take: 3
        });

        let response: any = {
            isCurrentUserInTop: false,
            topUsers: [],
            currentUser: {}
        }

        let isCurrentInTop = false;
        for (let data of profileData) {
            const levelInfo = checkLevel(data.xp);
            data.currentLevel = levelInfo.currentLevel;
            if (data.user_id === req.payload.user_id) {
                data.isCurrentUser = true;
                response.isCurrentUserInTop = true
                isCurrentInTop = true;
            }
            delete data.user_id;
        }



        const userXp: any = await prisma.users.findUnique({
            where: {
                user_id: req.payload.user_id
            },
            select: {
                name: true,
                xp: true,
                email: true,
                created_at: true
            }
        })
        const levelInfo = checkLevel(userXp.xp);
        userXp.currentLevel = levelInfo.currentLevel;
        response = { ...response, currentUser: userXp, topUsers: profileData }

        res.json(SUCCESS(response))
    } catch (error) {
        console.log(`GET PROFILE DATA ${error}`);
        res.json(ISE());
    }
}

export const resetProfileData = async (req: any, res: Response) => {
    try {
        const userId = req.payload?.user_id;

        if (!userId) {
            res.status(400).json({ message: "Invalid user_id" })
            return;
        }

        // await prisma.$transaction([
        //   prisma.users.update({
        //     data: {
        //       xp: 0,
        //       current_streak: 1,
        //       highest_streak: 1,
        //     },
        //     where: { user_id: userId },
        //   }),

        //   prisma.journals.deleteMany({ where: { user_id: userId } }),
        //   prisma.self_reflection.deleteMany({ where: { user_id: userId } }),
        //   prisma.user_mood.deleteMany({ where: { user_id: userId } }),
        //   prisma.task.deleteMany({ where: { user_id: userId } }),
        // ]);

        res.json(SUCCESS());
    } catch (error) {
        console.error(`RESET PROFILE FAILED:`, error);
        res.status(500).json(ISE());
    }
}