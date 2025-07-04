import { Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { createJournalSchema, updateJournalSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from "../utils/date-helper";

export const getJournal = async(req:any, res: Response) => {
    try{
        const journal = await prisma.journals.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(req.body?.date)
            }
        });
        res.json({journal});
    }catch(error){
        console.log(`GET JOURNAL FAILED ${error}`);
        res.json(ISE());
    }
}


export const addJournal = async(req: any, res: Response) => {
    try{
        const v_data = createJournalSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ());
            return;
        }

        const journal = await prisma.journals.create({
            data:{
                journal: req.body.journal,
                user_id: req.payload.user_id
            }
        })

        res.json({journal});
    }catch(error){
        console.log(`CREATE JOURNAL FAILED ${error}`);
        res.json(ISE())
    }
}

export const updateJournal = async(req:any, res: Response) => {
    try{
        const v_data = updateJournalSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ());
            return;
        }

        await prisma.journals.update({
            data: {
                journal: req.body.journal
            },
            where: {
                journal_id: req.body.journal_id,
                user_id: req.body.user_id
            }
        })

        res.json(SUCCESS());
    }catch(error){
        console.log(`UPDATE JOURNAL ERROR ${error}`);
        res.json(ISE());
    }
}