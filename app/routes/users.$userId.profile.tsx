import { LoaderFunctionArgs, json } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { getUserProfile } from '~/server/user.server'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = zx.parseParams(params, {
    userId: z.string()
  })
  if (!userId) {
    throw new Error('No username provided')
  }

  const profile = await getUserProfile({ userId })
  if (!profile) {
    return json({ profile: [] })
  }
}
