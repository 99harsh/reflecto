import { Request, Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { logMoodSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from "../utils/date-helper";
import { xpInfo } from "../utils/stats-helper";

export const allMoods = async (req: Request, res: Response) => {
    try {
        const allMoods = await prisma.all_moods.findMany();
        res.json(SUCCESS(allMoods));
    } catch (error) {
        console.log(`GET ALL MOODS FAILED ${error}`);
        res.json(ISE());
    }
}

export const getMood = async (req: any, res: Response) => {
    try {
        const mood = await prisma.user_mood.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(req.body?.date)
            }
        })

        res.json(SUCCESS(mood))
    } catch (error) {
        console.log(`GET MOOD FAILED ${error}`);
        res.json(ISE())
    }
}


export const logMood = async (req: any, res: Response) => {
    try {
        const v_data = logMoodSchema.safeParse(req.body);

        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        const userXP: any = await prisma.users.findUnique({
            where: {
                user_id: req.payload.user_id
            }
        });

        const updatedXP = userXP.xp + xpInfo.mood;

        const userUpdatedXP = await prisma.users.update({
            where: {
                user_id: req.payload.user_id
            },
            data: {
                xp: updatedXP
            }
        })

        const logged = await prisma.user_mood.create({
            data: {
                ...v_data.data,
                user_id: req.payload.user_id,

            }
        });

        res.json(SUCCESS({ updated_at: logged.updated_at }));
    } catch (error) {
        console.log(`LOG MOOD FAILED ${error}`);
        res.json(ISE());
    }
}