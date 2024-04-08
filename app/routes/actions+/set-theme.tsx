import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { setTheme } from '~/.server/theme.server.ts'
export async function loader() {
    return redirect('/')
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    return await setTheme(formData, request)
}
