import zod from 'zod';

export const authSchema = zod.object({
    token: zod.string()
})