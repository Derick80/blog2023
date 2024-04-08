/* eslint-disable @typescript-eslint/no-namespace */
/* https://www.jacobparis.com/content/type-safe-env */
import { TypeOf, z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),

    DATABASE_URL: z.string(),
    SESSION_SECRET: z.string(),

    BASE_PASSWORD: z.string(),
    SEED_EMAIL: z.string(),

    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),

    DISCORD_CALLBACK_URL: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),

    DISCORD_CLIENT_ID: z.string(),

    RESEND_API_KEY: z.string(),
    ENCRYPTION_SECRET: z.string()
})

export function getSharedEnvs() {
    return {
        NODE_ENV: process.env.NODE_ENV,
        ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET
    }
}
export type Env = z.infer<typeof envSchema>

declare global {
    namespace NodeJS {
        interface ProcessEnv extends TypeOf<typeof envSchema> {}
    }
}
