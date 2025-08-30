import { Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { saveJournalSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from "../utils/date-helper";
import { streak_activity_ids, xpInfo } from "../utils/stats-helper";
import { base64ToBytes, bytesToBase64 } from "../utils/encryption-helper";
import { getIP, track } from "../utils/mixpanel-helper";

export const getJournal = async (req: any, res: Response) => {
    try {
        const journal:any = await prisma.journals.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(req.body?.date)
            }
        });
        res.json(SUCCESS({...journal, ciphertext: bytesToBase64(journal?.ciphertext), iv: bytesToBase64(journal?.iv)}));
    } catch (error) {
        console.log(`GET JOURNAL FAILED ${error}`);
        res.status(500).json(ISE());
    }
}

export const saveJournal = async (req: any, res: Response) => {
    try {
        const v_data = saveJournalSchema.safeParse(req.body);

        if (!v_data.success) {
            res.status(400).json(BADREQ());
            return;
        }
        track("Save Journal", {distinct_id: req.payload.user_id, ip: getIP(req)})
        if (v_data.data?.journal_id) {
            const updated = await prisma.journals.update({
                data: {
                    ciphertext: base64ToBytes(v_data.data.ciphertext),
                    iv: base64ToBytes(v_data.data.iv),
                    updated_at: new Date()
                },
                where: {
                    journal_id: v_data.data.journal_id,
                    user_id: req.payload.user_id
                }
            });

            res.json(SUCCESS({ updated_at: updated.updated_at, journal_id: updated.journal_id }));
            return;
        }

        const currentXP: any = await prisma.users.findUnique({
            where: {
                user_id: req.payload.user_id
            }
        });

        const updatedXP = currentXP.xp + xpInfo.jorunal;

        const updatedUserXP = await prisma.users.update({
            where: {
                user_id: req.payload.user_id
            },
            data: {
                xp: updatedXP
            }
        })

        const created = await prisma.journals.create({
            data: {
                user_id: req.payload.user_id,
                ciphertext: base64ToBytes(v_data.data.ciphertext),
                iv: base64ToBytes(v_data.data.iv),
            }
        });

        await prisma.users_streak.create({
            data: {
                user_id: req.payload.user_id,
                streak_id: streak_activity_ids.journal
            }
        })

        res.json(SUCCESS({ journal_id: created.journal_id, updated_at: created.updated_at }));

    } catch (error) {
        console.log(`SAVE JOURNAL ERROR ${error}`);
        res.status(500).json(ISE());
    }
}