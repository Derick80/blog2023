import type { V2_MetaFunction } from '@remix-run/react'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'

import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/server/prisma.server'
import { isAuthenticated } from '~/server/auth/auth.server'
export const meta: V2_MetaFunction = () => {
  return [
    { title: `Derick's Blog` },
    { name: 'description', content: 'A new Remix app' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
}

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  const userId = user?.id

  if (!userId) return json({ user: null })

  return json({ user: await prisma.user.findUnique({ where: { id: userId } }) })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className=''>
      <h1>Welcome to My Social Media App</h1>
      {data && data.user && (
        <ul>
          <li>{data.user.email} </li>
          <li>{data.user.role} </li>
        </ul>
      )}
    </div>
  )
}
