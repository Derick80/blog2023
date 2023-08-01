import type { V2_MetaFunction } from '@remix-run/react'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'

import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import { fetchSecureUrls } from '~/server/auth/cloudinary.server'
export const meta: V2_MetaFunction = () => {
  return [
    { title: `Derick's Blog` },
    { name: 'description', content: 'A new Remix app' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
}

export async function loader({ request }: LoaderArgs) {
  // const testdata = await fetchSecureUrls()
  // console.log(testdata, 'test data')
  const data = await prisma.poll.findFirst({
    include: {
      votes: true,
      _count: {
        select: { votes: true, options: true }
      },

      options: {
        include: {
          votes: true,
          _count: {
            select: { votes: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  if (!data) {
    throw new Error('No data found')
  }

  return json({ data })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  const navigate = useNavigation()
  const user = useOptionalUser()
  return (
    <div
      className={
        navigate.state === 'loading'
          ? 'opacity-25 transition-opacity delay-200'
          : 'mx-auto flex flex-col items-center'
      }
    >
      <h1>Welcome to My Social Media App</h1>

      <ul>
        {user && (
          <li>
            <div className='flex flex-row'>
              <p>{user.email}</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}
