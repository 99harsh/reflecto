import { Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import {  saveJournalSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from "../utils/date-helper";
import { streak_activity_ids, xpInfo } from "../utils/stats-helper";

export const getJournal = async(req:any, res: Response) => {
    try{
        const journal = await prisma.journals.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(req.body?.date)
            }
        });
        res.json(SUCCESS(journal));
    }catch(error){
        console.log(`GET JOURNAL FAILED ${error}`);
        res.json(ISE());
    }
}

export const saveJournal = async(req:any, res:Response) => {
    try{    
        const v_data = saveJournalSchema.safeParse(req.body);

        if(!v_data.success){
            res.json(BADREQ());
            return;
        }

        if(v_data.data?.journal_id){
            const updated = await prisma.journals.update({
                data: {
                    journal: v_data.data.journal,
                    updated_at: new Date()
                },
                where: {
                    journal_id: v_data.data.journal_id,
                    user_id: req.payload.user_id
                }
            });

            res.json(SUCCESS({updated_at: updated.updated_at, journal_id: updated.journal_id}));
            return;
        }

        const currentXP:any = await prisma.users.findUnique({
            where:{
                user_id: req.payload.user_id
            }
        });

        const updatedXP = currentXP.xp + xpInfo.jorunal;

        const updatedUserXP = await prisma.users.update({
            where: {
                user_id :req.payload.user_id
            },
            data: {
                xp: updatedXP
            }
        }) 

        const created = await prisma.journals.create({
            data: {
                user_id: req.payload.user_id,
                journal: v_data.data.journal
            }
        });
        
        await prisma.users_streak.create({
            data: {
                user_id: req.payload.user_id,
                streak_id: streak_activity_ids.journal
            }
        })

        res.json(SUCCESS({journal_id: created.journal_id, updated_at: created.updated_at}));
        
    }catch(error){
        console.log(`SAVE JOURNAL ERROR ${error}`);
        res.json(ISE());
    }
}