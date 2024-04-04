import { json } from '@remix-run/node'
import type { Theme } from './session.server'
import { getSession } from '~/routes/_auth+/auth.server'
import { z } from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { sessionStorage } from '../routes/_auth+/auth.server'
const THEME_PREFERENCE_KEY = 'theme'

const ThemeFormSchema = z.object({
    theme: z.enum(['system', 'light', 'dark']).default('system')
})
export const createThemeCookie = async (request: Request, theme: Theme) => {
    const session = await getSession(request)
    session.set(THEME_PREFERENCE_KEY, theme)
    const headers = new Headers({
        'Set-Cookie': await sessionStorage.commitSession(session)
    })
    console.log(theme, 'theme from createThemeCookie')

    return json(
        { theme },
        {
            headers
        }
    )
}

export const getThemeFromCookie = async (request: Request) => {
    const session = await getSession(request)

    const theme = session.get(THEME_PREFERENCE_KEY) || 'system'
    return theme
}

export const setTheme = async (formData: FormData, request: Request) => {
    const submission = parseWithZod(formData, {
        schema: ThemeFormSchema
    })

    if (submission.status !== 'success') {
        return json(
            { result: submission.reply() },
            { status: submission.status === 'error' ? 400 : 200 }
        )
    }

    const { theme } = submission.value
    return createThemeCookie(request, theme)
}
