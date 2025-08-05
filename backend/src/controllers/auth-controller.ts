import { Request, Response } from 'express';
import { authSchema } from '../utils/validations';
import { BADREQ, ISE, SUCCESS, UNAUTHACCESS } from '../utils/responses';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import prisma from '../utils/db';
import { createUserAuthToken } from '../middlewares/auth-middleware';

const client = new OAuth2Client(process.env.CLIENT_ID)


export const authenticate = async(req: Request, res: Response) => {
    try{    
        const validated_token = authSchema.safeParse(req.body);

        if(!validated_token.success){
             res.json(BADREQ());
             return;
        }

        const ticket = await client.verifyIdToken({
            idToken: validated_token.data.token,
            audience: process.env.CLIENT_ID
        });

        const user_payload = ticket.getPayload();
        if(typeof user_payload == "object" && user_payload && user_payload.name && user_payload.email && user_payload.picture){
            const user_data = await prisma.users.upsert({
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
                    xp: 0
                }
            })

            const token = await createUserAuthToken({name: user_data.name, email: user_data.email, user_id: user_data.user_id });

            res.cookie('token', token, {httpOnly: true, secure: false, sameSite: 'none'});
            res.json(SUCCESS({name: user_data.name, email: user_data.email, profile_photo: user_data.profile_photo, xp: user_data.xp}));

        }else{  
            res.json(UNAUTHACCESS());
        }

    }catch(error){
        console.log(`AUTHENTICATION FAILED ${error}`);
        res.json(ISE())
    }
}

export const profile = async(req: any, res:any) => {
    try{
        const user_id = req.payload.user_id;
        console.log("Profile")
        const data = await prisma.users.findFirst({
            where: {
                user_id: user_id
            },
            select: {
                name: true,
                email: true,
                profile_photo: true,
                xp: true
            }
        });

        res.json(SUCCESS(data));
    }catch(error){
        console.log(`PROFILE ERROR ${error}`)
        res.json(ISE())
    }
}