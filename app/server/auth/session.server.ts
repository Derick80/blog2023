import type { Session } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'

// Create a session storage that uses cookies to store the session data.  This is the basic session storage setup that I used in my Auth server files.

const secret = process.env.SESSION_SECRET
if (!secret) {
  throw new Error('SESSION_SECRET is not set')
}
const ONE_YEAR = 60 * 60 * 24 * 365
// revisit secure before production
const cookieOptions = {
  name: '__message',
  httpOnly: true,
  sameSite: 'lax' as 'lax',
  path: '/',
  expires: new Date(Date.now() + ONE_YEAR * 1000),
  secrets: [secret],
  secure: false
}

export const {commitSession, getSession} = createCookieSessionStorage({
  cookie: cookieOptions
})

export const sessionStorage = createCookieSessionStorage({
  cookie: cookieOptions
})



export type ToastMessage = { message: string; type: 'success' | 'error' }

export function setSuccessMessage(session: Session, message: string) {
  session.flash('toastMessage', { message, type: 'success' } as ToastMessage)
}

export function setErrorMessage(session: Session, message: string) {
  session.flash('toastMessage', { message, type: 'error' } as ToastMessage)
}