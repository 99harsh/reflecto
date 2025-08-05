import { Response } from 'express';
import prisma from '../utils/db';
import { BADREQ, ISE, SUCCESS } from '../utils/responses';
import { dateFilter } from '../utils/date-helper';
import { createSelfReflectionSchema, updateSelfReflectionSchema, saveSelfReflectionSchema } from '../utils/validations';

export const getSelfReflection = async (req: any, res: Response) => {
    try {

            const reflection = await prisma.self_reflection.findFirst({
                where: {
                    user_id: req.payload.user_id,
                    updated_at: dateFilter(req.body?.date),
                },
                select:{
                    self_reflection:true,
                    updated_at: true,
                    self_reflection_id: true
                }
            })
            res.json(SUCCESS(reflection));
       


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

                user_id: req.payload.user_id
            }
        })

        res.json(SUCCESS());
    }catch(error){
        console.log(`UPDATE SELF REFLECTION FAILED ${error}`);
        res.json(ISE());
    }
}

export const saveSelfReflection = async(req:any, res:any) => {
    try{
        const v_data = saveSelfReflectionSchema.safeParse(req.body);
        if(!v_data.success){
            res.json(BADREQ());
            return;
        }

        if(v_data.data?.self_reflection_id){
            const updated = await prisma.self_reflection.update({
                data: {
                    self_reflection: v_data.data.self_reflection,
                },
                where: {
                    self_reflection_id: v_data.data.self_reflection_id,
                    user_id: req.payload.user_id
                }
            })

            res.json(SUCCESS({updated_at: updated.updated_at, self_reflection_id: updated.self_reflection_id}));
            return;
        }
        
        const created = await prisma.self_reflection.create({
            data: {
                self_reflection: v_data.data.self_reflection,
                user_id: req.payload.user_id
            }
        })

        res.json(SUCCESS({
            updated_at: created.updated_at,
            self_reflection_id: created.self_reflection_id
        }))
    }catch(error){
        console.log(`SAVE SELF REFLECTION FAILED ${error}`);
        res.json(ISE())
    }
}