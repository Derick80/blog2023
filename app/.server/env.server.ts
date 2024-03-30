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

    DISCORD_CLIENT_ID: z.string()
})

const environment = () => envSchema.parse(process.env)

export { environment }

export type Env = z.infer<typeof envSchema>

declare global {
    namespace NodeJS {
        interface ProcessEnv extends TypeOf<typeof envSchema> {}
    }
}

try {
    envSchema.parse(process.env)
} catch (err) {
    if (err instanceof z.ZodError) {
        const { fieldErrors } = err.flatten()
        const errorMessage = Object.entries(fieldErrors)
            .map(([field, errors]) =>
                errors ? `${field}: ${errors.join(', ')}` : field
            )
            .join('\n  ')
        throw new Error(`Missing environment variables:\n  ${errorMessage}`)
        process.exit(1)
    }
}
