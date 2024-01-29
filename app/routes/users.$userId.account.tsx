import { LoaderFunctionArgs, json } from '@remix-run/node'
import { getUser } from '~/server/user.server'
import { zx } from 'zodix'
import { z } from 'zod'
import { useLoaderData } from '@remix-run/react'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = zx.parseParams(params, {
    userId: z.string()
  })
  if (!userId) {
    throw new Error('No username provided')
  }

  const account = await getUser({ id: userId })
  if (!account) {
    return json({ account: [] })
  }

  return json({ account })
}

export default function UserAccountRoute() {
  const { account } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <h1>Account</h1>
      <pre className='flex flex-col items-center justify-center w-full h-full'>
        {JSON.stringify(account, null, 2)}
      </pre>
    </div>
  )
}
