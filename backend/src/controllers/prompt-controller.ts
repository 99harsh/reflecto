import prisma from '../utils/db';
import { Response } from "express";
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { addUserPromptSchema, deleteUserPromptSchema } from '../utils/validations';

export const allPrompts = async(req:any, res: Response) => {
    try{
        const prompts = await prisma.prompts.findMany();
        res.json(SUCCESS(prompts));
    }catch(error){
        console.log(`GET ALL PROMPTS FAILED ${error}`);
        res.json(ISE());
    }
}