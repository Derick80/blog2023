import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { z } from 'zod'
import { createThemeCookie } from '~/.server/theme.server.ts'
import { parseWithZod } from '@conform-to/zod'
export async function loader() {
    return redirect('/')
}
const schema = z.object({
    theme: z.enum(['system', 'light', 'dark']).default('system')
})
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const submission = parseWithZod(formData, {
        schema
    })

    if (submission.status !== 'success') {
        console.log('theme-action');

        return createThemeCookie(request, 'system')
    }
    console.log(submission, 'submission')

    const { theme } = submission.value
    return createThemeCookie(request, theme)
}
