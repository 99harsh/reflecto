import { Response } from 'express';
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { addTaskSchema, deleteTaskSchema, updateTaskSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from '../utils/date-helper';

export const getTasks = async (req: any, res: Response) => {
    try {
    
        const tasks = await prisma.task.findMany({
            where: {
                user_id: req.payload.user_id,
                created_at: dateFilter(req.body?.date)
            }
        })
        res.json(SUCCESS(tasks));
    } catch (error) {
        console.log(`GET TASK FAILED ${error}`);
        res.json(ISE());
    }
}

export const addTask = async (req: any, res: Response) => {
    try {
        const v_data = addTaskSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ());
            return;
        }

        const task = await prisma.task.create({
            data: {
                task: v_data.data.task,
                user_id: req.payload.user_id,
                completed: false
            }
        })

        res.json(SUCCESS(task));

    } catch (error) {
        console.log(`ADD TASK FAILED ${error}`);
        res.json(ISE());
    }
}

export const deleteTask = async (req: any, res: Response) => {
    try {
        const v_data = deleteTaskSchema.safeParse(req.body);
        if (!v_data.success) {
            res.json(BADREQ())
            return;
        }

        await prisma.task.delete({
            where: {
                task_id: v_data.data.task_id,
                user_id: req.payload.user_id
            }
        })

        res.json(SUCCESS());
    } catch (error) {
        console.log(`DELETE TASK FAILED ${error}`);
        res.json(ISE());
    }
}

export const updateTask = async(req:any, res: Response) => {
    try{
        const v_data = updateTaskSchema.safeParse(req.body);

        if(!v_data.success){
            res.json(BADREQ());
            return;
        }

         await prisma.task.update({
            data: {
                completed: v_data.data.completed
            },
            where: {
                task_id: v_data.data.task_id,
                user_id: req.payload.user_id
            }
        })

        res.json(SUCCESS());

    }catch(error){
        console.log(`UPDATE TASK FAILED ${error}`);
        res.json(ISE());
    }
}