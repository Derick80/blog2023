import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { createThemeCookie } from '../.server/theme.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect('/')
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { theme = 'system' } = await request.json()
  return createThemeCookie(request, theme)
}
