import zod from 'zod';

export const authSchema = zod.object({
    token: zod.string()
})

export const addTaskSchema = zod.object({
    task: zod.string()
})

export const deleteTaskSchema = zod.object({
    task_id: zod.number()
})