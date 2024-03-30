import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { z } from 'zod'
import { createThemeCookie } from '~/.server/theme.server.ts'
import { parseWithZod } from '@conform-to/zod'
export async function loader () {
    return redirect('/')
}
const schema = z.object({
    theme: z.string()
})
export async function action ({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const submission =  parseWithZod(formData, {
        schema,
    })

    if (submission.status !== 'success') {
        return '400 Bad Request'
    }
    console.log(submission, 'submission');

    const { theme } = submission.value
    return createThemeCookie(request,theme )
}
