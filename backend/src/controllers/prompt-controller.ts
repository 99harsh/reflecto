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

export const addUserPrompt = async(req:any, res:Response) => {
    try{
        const v_data = addUserPromptSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ());
            return;
        }
        const prompt = await prisma.user_prompts.create({
            data: {
                user_id: req.payload.user_id,
                prompt_id: v_data.data.prompt_id
            }
        })
        res.json(SUCCESS({user_prompt_id: prompt.user_prompt_id}))
    }catch(error){
        console.log(`ADD USER PROMPT FAILED ${error}`);
        res.json(ISE());
    }
}

export const deleteUserPrompt = async(req:any, res:Response) => {
    try{
        const v_data = deleteUserPromptSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ())
            return;
        }
        
        await prisma.user_prompts.delete({
            where: {
                user_prompt_id: v_data.data.user_prompt_id,
                prompt_id: v_data.data.prompt_id,
                user_id: req.payload.user_id
            }
        });

        await prisma.self_reflection.deleteMany({
            where: {
                prompt_id: v_data.data.prompt_id,
                user_id: req.payload.user_id
            }
        })
        res.json(SUCCESS());

    }catch(error){
        console.log(`DELETE USER PROMPT FAILED ${error}`);
        res.json(ISE());
    }
}

export const getUserPrompts = async (req: any, res: Response) => {
    try {
        const prompts = await prisma.user_prompts.findMany({
            where: {
                user_id: req.payload.user_id
            }
        });
        
        res.json(SUCCESS(prompts));
    } catch (error) {
        console.log(`GET USER PROMPT FAILED ${error}`);
        res.json(ISE());
    }
}