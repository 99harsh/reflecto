import { Response } from 'express';
import prisma from '../utils/db';
import { BADREQ, ISE, SUCCESS } from '../utils/responses';
import { dateFilter } from '../utils/date-helper';
import { createSelfReflectionSchema, updateSelfReflectionSchema } from '../utils/validations';

export const getSelfReflection = async (req: any, res: Response) => {
    try {
        if (req.body?.date) {
            const reflection = await prisma.self_reflection.findMany({
                where: {
                    user_id: req.payload.user_id,
                    updated_at: dateFilter(req.body.date),
                },
                select:{
                    self_reflection:true,
                    updated_at: true,
                    prompts: true
                }
            })
            res.json(SUCCESS(reflection));
        } else {
        
            const reflection = await prisma.self_reflection.findMany({
                where: {
                    prompt_id: {
                        in: req.body.prompt_ids
                    },
                    user_id: req.payload.user_id
                }
            });
            res.json(SUCCESS(reflection));
        }


    } catch (error) {
        console.log(`GET SELF REFLECTION FAIELD ${error}`)
        res.json(ISE());
    }
}

export const createSelfReflection = async(req:any, res:Response) => {
    try{
        const v_data = createSelfReflectionSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ());
            return;
        }
        
        const reflection = await prisma.self_reflection.create({
            data:{
                prompt_id: v_data.data.prompt_id,
                user_id: req.payload.user_id,
                self_reflection: v_data.data.self_reflection
            }
        });

        res.json(SUCCESS({self_reflection_id: reflection.self_reflection_id}));

    }catch(error){
        console.log(`CREATE SELF REFLECTION FAILED ${error}`);
        res.json(ISE());
    }
}

export const updateSelfReflection = async(req:any, res:Response) => {
    try{
        const v_data = updateSelfReflectionSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ());
            return;
        }

        await prisma.self_reflection.update({
            data: {
                self_reflection: v_data.data.self_reflection
            },
            where: {
                self_reflection_id: v_data.data.self_reflection_id,
                prompt_id: v_data.data.prompt_id,
                user_id: req.payload.user_id
            }
        })

        res.json(SUCCESS());
    }catch(error){
        console.log(`UPDATE SELF REFLECTION FAILED ${error}`);
        res.json(ISE());
    }
}