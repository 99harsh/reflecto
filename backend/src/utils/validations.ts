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

export const saveJournalSchema = zod.object({
    journal_id: zod.number().optional(),
    ciphertext: zod.string(),
    iv: zod.string()
})

//Mood
export const logMoodSchema = zod.object({
    mood_id: zod.number(),
    intensity: zod.number()
});

//Self Reflection
export const saveSelfReflectionSchema = zod.object({
     self_reflection_id: zod.number().optional(),
    ciphertext: zod.string(),
    iv: zod.string()
})

//Prompts
export const addUserPromptSchema = zod.object({
    prompt_id: zod.number()
})

export const deleteUserPromptSchema = zod.object({
    user_prompt_id: zod.number(),
    prompt_id: zod.number()
});

//Stats

export const getDashboardCardDetailsSchema = zod.object({
    user_id: zod.number()
})

export const getDateInsightsSchema = zod.object({
    date: zod.string()
})