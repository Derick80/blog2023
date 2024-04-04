import { z } from 'zod'
/* https://dev.to/remix-run-br/type-safe-environment-variables-on-both-client-and-server-with-remix-54l5 */

// Create a session storage that uses cookies to store the session data.  This is the basic session storage setup that I used in my Auth server files.

// 7.26.23 changed lax as 'lax' to lax as const
// revisit secure before production
const cookieOptions = {
    name: 'dch_com_session',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secrets: [process.env.SESSION_SECRET],
    secure: false
}

const userCookieSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system')
})

export type Theme = z.infer<typeof userCookieSchema>['theme']
