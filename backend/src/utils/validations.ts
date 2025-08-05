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

export const updateTaskSchema = zod.object({
    task_id: zod.number(),
    completed: zod.boolean()
})

//Journal
export const createJournalSchema = zod.object({
    journal: zod.string()
})
export const updateJournalSchema = zod.object({
    journal_id: zod.number(),
    journal: zod.string()
})

export const saveJournalSchema = zod.object({
    journal_id: zod.number().optional(),
    journal: zod.string()
})

//Mood
export const logMoodSchema = zod.object({
    mood_id: zod.number(),
    intensity: zod.number()
});

//Self Reflection
export const createSelfReflectionSchema = zod.object({
    prompt_id: zod.number(),
    self_reflection: zod.string()
})

export const updateSelfReflectionSchema = zod.object({
    self_reflection_id: zod.number(),
    prompt_id: zod.number(),
    self_reflection: zod.string()
})

export const saveSelfReflectionSchema = zod.object({
     self_reflection_id: zod.number().optional(),
     self_reflection: zod.string()
})

//Prompts
export const addUserPromptSchema = zod.object({
    prompt_id: zod.number()
})

export const deleteUserPromptSchema = zod.object({
    user_prompt_id: zod.number(),
    prompt_id: zod.number()
})