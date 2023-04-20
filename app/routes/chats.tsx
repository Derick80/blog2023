import { LoaderArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage
} from '~/server/auth/session.server'

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
  const userId = user.id
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: userId
        }
      }
    },
    select: {
      id: true
    }
  })

  return json({ chats })
}

export default function ChatsRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className='items- flex h-screen w-full flex-col overflow-auto border-2'>
      <h1>Chats</h1>
      {data.chats.map((chat) => (
        <div key={chat.id}>
          {/* <Outlet
                        context={`/chats/${chat.id}`}
                     /> */}
        </div>
      ))}
      <hr />
      <Outlet />
    </div>
  )
}
