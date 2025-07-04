import { Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { createMoodSchema, updateMoodSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from "../utils/date-helper";

export const getMood = async(req: any, res:Response) => {
    try{ 
        const mood = await prisma.user_mood.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(req.body?.date)
            }
        }) 
        
        res.json({mood})
    }catch(error){
        console.log(`GET MOOD FAILED ${error}`);
        res.json(ISE())
    }
}

export const createMood = async (req: any, res: Response) => {
    try {
        const v_data = createMoodSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        const mood = await prisma.user_mood.create({
            data: {
                mood_id: v_data.data.mood_id,
                user_id: req.payload.user_id,
            }
        })

        res.json(SUCCESS({ mood }));
    } catch (error) {
        console.log(`Create Mood Failed ${error}`);
        res.json(ISE());
    }
}

export const updateMood = async (req: any, res: Response) => {
    try {
        const v_data = updateMoodSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        await prisma.user_mood.update({
            where: {
                user_mood_id: v_data.data.user_mood_id,
                user_id: req.body.user_id
            },
            data: {
                mood_id: v_data.data.mood_id
            }
        })

        res.json(SUCCESS())
    } catch (error) {
        console.log(`UPDATE MOOD FAILED ${error}`)
        res.json(ISE());
    }
}