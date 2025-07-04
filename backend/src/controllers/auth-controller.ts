import { Request, Response } from 'express';
import { authSchema } from '../utils/validations';
import { BADREQ, SUCCESS, UNAUTHACCESS } from '../utils/responses';
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
            const user_data = await prisma.user.upsert({
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

            const token = createUserAuthToken({name: user_data.name, email: user_data.email, user_id: user_data.user_id });
            res.cookie('token', token, {httpOnly: true});
            res.json(SUCCESS({name: user_data.name, email: user_data.email, profile_photo: user_data.profile_photo, xp: user_data.xp}));

        }else{  
            res.json(UNAUTHACCESS());
        }

    }catch(error){
        console.log("Error", error);
        res.json(BADREQ())
    }
}