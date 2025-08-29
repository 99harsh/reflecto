import { Request, Response } from 'express';
import { authSchema } from '../utils/validations';
import { BADREQ, ISE, SUCCESS, UNAUTHACCESS } from '../utils/responses';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import prisma from '../utils/db';
import { createUserAuthToken } from '../middlewares/auth-middleware';
import { env } from 'process';
import { base64ToUint8Array, uint8ArrayToBase64 } from '../utils/encryption-helper';
import { differenceInDays } from 'date-fns/differenceInDays';
import { isSameDay } from 'date-fns/isSameDay';
import { streak_activity_ids, xpInfo } from '../utils/stats-helper';

const client = new OAuth2Client(process.env.CLIENT_ID)


export const authenticate = async (req: any, res: Response) => {
    try {
        const validated_token = authSchema.safeParse(req.body);

        if (!validated_token.success) {
            res.status(400).json(BADREQ());
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: validated_token.data.token,
            audience: process.env.CLIENT_ID
        });

        const user_payload = ticket.getPayload();
        if (typeof user_payload == "object" && user_payload && user_payload.name && user_payload.email && user_payload.picture) {
            let salt:any = crypto.getRandomValues(new Uint8Array(16));
            console.log(salt);
            const user_data:any = await prisma.users.upsert({
                where: {
                    email: user_payload.email
                },
                update: {
                    last_login: new Date(),
                },
                create: {
                    name: user_payload.name,
                    email: user_payload.email,
                    profile_photo: user_payload.picture,
                    xp: 0,
                    salt: salt
                }
            })

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
            console.log(last_login)
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

            const token = await createUserAuthToken({ name: user_data.name, email: user_data.email, user_id: user_data.user_id });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'lax',  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), maxAge: 90 * 24 * 60 * 60 * 1000  });
            res.json(SUCCESS({ name: user_data.name, email: user_data.email, profile_photo: user_data.profile_photo, xp: user_data.xp, salt: user_data?.salt }));

        } else {
            res.status(401).json(UNAUTHACCESS());
        }

    } catch (error: any) {
        console.log(`AUTHENTICATION FAILED ${error}`);
        res.json(ISE())
    }
}

export const profile = async (req: any, res: any) => {
    try {
        const user_id = req.payload.user_id;
        const data:any = await prisma.users.findFirst({
            where: {
                user_id: user_id
            },
            select: {
                name: true,
                email: true,
                profile_photo: true,
                xp: true,
                salt: true
            }
        });
        res.json(SUCCESS({...data}));
    } catch (error) {
        console.log(`PROFILE ERROR ${error}`)
        res.status(500).json(ISE())
    }
}

export const logout = async (req: any, res: any) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'lax' });
        res.json(SUCCESS())
    } catch (error) {
        console.log(`LOGOUT FAILED ${error}`);
        res.status(500).json(ISE());
    }
}