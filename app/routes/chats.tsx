import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet, Link } from '@remix-run/react'
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
      id: true,
      users: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          email: true
        }
      },
      messages: {
        select: {
          id: true,
          content: true,
          userId: true
        }
      }
    }
  })
  const users = chats.map((user) => user.users)

  return json({ chats })
}

export default function ChatsRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className='items- flex h-screen w-full flex-col overflow-auto border-2'>
      <h1>Chats</h1>
      {data.chats.map((chat) => (
        <div key={chat.id}>
          <Link to={`/chats/${chat.id}`}>
            {chat.users.map((user) => (
              <div key={user.id}>
                <img
                  src={user.avatarUrl ?? ''}
                  alt={''}
                  className='h-8 w-8 rounded-full'
                />
                <div>{user.username}</div>
              </div>
            ))}
          </Link>

          <Outlet context={`/chats/${chat.id}`} />
        </div>
      ))}
      <hr />
    </div>
  )
}
