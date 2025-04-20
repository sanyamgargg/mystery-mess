import {z} from 'zod'

export const signIpSchema = z.object({
    identifier: z.string().min(2).max(20) ,
    password: z.string().min(6)
})