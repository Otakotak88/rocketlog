import { z } from "zod"

const bodySchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.string(),
    JWT_SECRET: z.string()
})

export const env = bodySchema.parse(process.env)