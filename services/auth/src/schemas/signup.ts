import {z} from '@repo/utils/zod';

export const userSchema = z.object({
    id:z.string().uuid(),
    email:z.string().email(),
    password:z.string().min(6),
})

export type User = z.infer<typeof userSchema>;