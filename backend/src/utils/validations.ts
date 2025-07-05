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

//Prompts
export const addUserPromptSchema = zod.object({
    prompt_id: zod.number()
})

export const deleteUserPromptSchema = zod.object({
    user_prompt_id: zod.number(),
    prompt_id: zod.number()
})