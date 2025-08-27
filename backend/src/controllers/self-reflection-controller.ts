import { Response } from 'express';
import prisma from '../utils/db';
import { BADREQ, ISE, SUCCESS } from '../utils/responses';
import { dateFilter } from '../utils/date-helper';
import { saveSelfReflectionSchema } from '../utils/validations';
import { streak_activity_ids, xpInfo } from '../utils/stats-helper';
import { base64ToBytes, bytesToBase64 } from '../utils/encryption-helper';

export const getSelfReflection = async (req: any, res: Response) => {
    try {

        const reflection: any = await prisma.self_reflection.findFirst({
            where: {
                user_id: req.payload.user_id,
                updated_at: dateFilter(req.body?.date),
            },
            select: {
                ciphertext: true,
                iv: true,
                updated_at: true,
                self_reflection_id: true
            }
        });
        res.json(
            SUCCESS({
                ...reflection,
                ...(reflection?.ciphertext != null && { ciphertext: bytesToBase64(reflection.ciphertext) }),
                ...(reflection?.iv != null && { iv: bytesToBase64(reflection.iv) }),
            })
        );



    } catch (error) {
        console.log(`GET SELF REFLECTION FAIELD ${error}`)
        res.status(500).json(ISE());
    }
}

export const saveSelfReflection = async (req: any, res: any) => {
    try {
        const v_data = saveSelfReflectionSchema.safeParse(req.body);
        if (!v_data.success) {
            res.status(400).json(BADREQ());
            return;
        }

        if (v_data.data?.self_reflection_id) {
            const updated = await prisma.self_reflection.update({
                data: {
                    ciphertext: base64ToBytes(v_data.data.ciphertext),
                    iv: base64ToBytes(v_data.data.iv),
                },
                where: {
                    self_reflection_id: v_data.data.self_reflection_id,
                    user_id: req.payload.user_id
                }
            })

            res.json(SUCCESS({ updated_at: updated.updated_at, self_reflection_id: updated.self_reflection_id }));
            return;
        }

        const userXP: any = await prisma.users.findUnique({
            where: {
                user_id: req.payload.user_id
            }
        });

        const updatedXP = userXP?.xp + xpInfo.reflection;

        const updatedUserXP = await prisma.users.update({
            where: {
                user_id: req.payload.user_id
            },
            data: {
                xp: updatedXP
            }
        })

        const created = await prisma.self_reflection.create({
            data: {
                ciphertext: base64ToBytes(v_data.data.ciphertext),
                iv: base64ToBytes(v_data.data.iv),
                user_id: req.payload.user_id
            }
        })

        await prisma.users_streak.create({
            data: {
                user_id: req.payload.user_id,
                streak_id: streak_activity_ids.self_reflection
            }
        })

        res.json(SUCCESS({
            updated_at: created.updated_at,
            self_reflection_id: created.self_reflection_id
        }))
    } catch (error) {
        console.log(`SAVE SELF REFLECTION FAILED ${error}`);
        res.status(500).json(ISE())
    }
}