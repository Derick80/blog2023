import { json } from '@remix-run/node'
import { commitSession, getSession } from './session.server'
import type { Theme } from './session.server'
const THEME_PREFERENCE_KEY = 'theme'

export const createThemeCookie = async (request: Request, theme: Theme) => {
    const session = await getSession(request.headers.get('Cookie'))
    session.set(THEME_PREFERENCE_KEY, theme)
    const headers = new Headers({
        'Set-Cookie': await commitSession(session)
    })
    return json(
        { theme },
        {
            headers
        }
    )
}

export const getThemeFromCookie = async (request: Request) => {
    const session = await getSession(request.headers.get('Cookie'))

    const theme = session.get(THEME_PREFERENCE_KEY) || 'system'
    return theme
}
