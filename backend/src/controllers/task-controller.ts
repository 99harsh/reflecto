import { Response } from 'express';
import { BADREQ, ISE, SUCCESS } from "../utils/responses";
import { addTaskSchema, deleteTaskSchema, updateTaskSchema } from "../utils/validations";
import prisma from '../utils/db';
import { dateFilter } from '../utils/date-helper';
import { streak_activity_ids, xpInfo } from '../utils/stats-helper';

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
        res.status(500).json(ISE());
    }
}

export const addTask = async (req: any, res: Response) => {
    try {
        const v_data = addTaskSchema.safeParse(req.body);
        if (!v_data.success) {
            res.status(400).json(BADREQ());
            return;
        }

        const userTask = await prisma.task.count({
            where: {
                user_id: req.payload.user_id,
                created_at: dateFilter()
            }
        });

        if (userTask === 0) {
            const userXP: any = await prisma.users.findUnique({
                where: {
                    user_id: req.payload.user_id
                }
            });

            const updatedXP = userXP.xp + xpInfo.task;

            const updatedUserXP = await prisma.users.update({
                where: {
                    user_id: req.payload.user_id
                },
                data: {
                    xp: updatedXP
                }
            })
            await prisma.users_streak.create({
                data: {
                    user_id: req.payload.user_id,
                    streak_id: streak_activity_ids.tasks
                }
            })
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
        res.status(500).json(ISE());
    }
}

export const deleteTask = async (req: any, res: Response) => {
    try {
        const v_data = deleteTaskSchema.safeParse(req.body);
        if (!v_data.success) {
            res.status(400).json(BADREQ())
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
        res.status(500).json(ISE());
    }
}

export const updateTask = async (req: any, res: Response) => {
    try {
        const v_data = updateTaskSchema.safeParse(req.body);

        if (!v_data.success) {
            res.status(400).json(BADREQ());
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

    } catch (error) {
        console.log(`UPDATE TASK FAILED ${error}`);
        res.status(500).json(ISE());
    }
}