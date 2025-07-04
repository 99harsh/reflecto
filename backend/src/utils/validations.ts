import zod from 'zod';

//Auth
export const authSchema = zod.object({
    token: zod.string()
})

//Task
export const addTaskSchema = zod.object({
    task: zod.string()
})

export const deleteTaskSchema = zod.object({
    task_id: zod.number()
})

//Journal
export const createJournalSchema = zod.object({
    journal: zod.string()
})
export const updateJournalSchema = zod.object({
    journal_id: zod.number(),
    journal: zod.string()
})

//Mood
export const createMoodSchema = zod.object({
    mood_id: zod.number()
})

export const updateMoodSchema = zod.object({
    user_mood_id: zod.number(),
    mood_id: zod.number()
})