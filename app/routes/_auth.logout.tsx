import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/server/auth/auth.server'

export const loader: LoaderFunction = () => redirect('/', { status: 404 })

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: '/login' })
}
