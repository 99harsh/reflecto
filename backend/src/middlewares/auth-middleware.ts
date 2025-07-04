import jwt from 'jsonwebtoken';
import { NextFunction,  Response } from 'express';
import { UNAUTHACCESS } from '../utils/responses';
import { IRequest } from '../utils/interfaces';
const { JWT_SECRET } = process.env; 
interface UserPayload{
    name: string,
    email: string,
    user_id: number,
}

export const createUserAuthToken = (payload: UserPayload) => {
    return new Promise((resolve, reject) => {
        try {
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: '24d'
            });
            resolve(token);
        } catch (error: any) {
            reject(error);
        }
    });
}

export const verifyUserAuthToken = (req: any, res: Response, next:NextFunction) => {
    try{
        const {token} = req.cookies;
        if(token && JWT_SECRET){
            const payload = jwt.verify(token, JWT_SECRET);
            req.payload = payload;
            return next();
        }
    }catch(error){  
        console.log(`VERIFY AUTH TOKEN FAILED ${error}`)
        res.json(UNAUTHACCESS());
    }
}