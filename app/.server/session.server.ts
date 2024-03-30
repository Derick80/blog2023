import type { Session } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'
import { environment } from './env.server'
import { createTypedSessionStorage } from "remix-utils/typed-session";
import { z } from 'zod';

/* https://dev.to/remix-run-br/type-safe-environment-variables-on-both-client-and-server-with-remix-54l5 */

// Create a session storage that uses cookies to store the session data.  This is the basic session storage setup that I used in my Auth server files.


// 7.26.23 changed lax as 'lax' to lax as const
// revisit secure before production
const cookieOptions = {
    name: 'dch_com_session',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secrets: [environment().SESSION_SECRET],
    secure: false
}

const userCookieSchema = z.object({
    theme: z.string().default('system')
})

const typedSessionStorage = createCookieSessionStorage({
    cookie: cookieOptions
})

export const { commitSession, getSession } = createTypedSessionStorage({sessionStorage:typedSessionStorage, schema: userCookieSchema})


// Toast message functions

export type ToastMessage = { message: string; type: 'success' | 'error' }

export function setSuccessMessage(session: Session, message: string) {
    session.flash('toastMessage', { message, type: 'success' } as ToastMessage)
}

export function setErrorMessage(session: Session, message: string) {
    session.flash('toastMessage', { message, type: 'error' } as ToastMessage)
}
