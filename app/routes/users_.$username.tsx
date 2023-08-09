import type { Chat } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link, Form, Outlet } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { RowBox } from '~/components/boxes'
import Button from '~/components/v3-components/button'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import { getSession, setErrorMessage } from '~/server/session.server'
import type { User } from '~/server/schemas/schemas'
import { useOptionalUser, validateAction } from '~/utilities'

export async function loader({ request, params }: LoaderArgs) {
  const username = params.username
  if (!username) {
    return { json: { message: 'No username provided' } }
  }
  const loggedInUser = await isAuthenticated(request)
  const user = await prisma.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      chats: loggedInUser
        ? {
            where: {
              users: {
                some: {
                  id: { equals: loggedInUser.id }
                }
              }
            },
            select: {
              id: true,
              users: {
                select: {
                  id: true,
                  email: true,
                  username: true,
                  avatarUrl: true,
                  chats: true
                }
              }
            }
          }
        : false
    }
  })

  if (!user) {
    return { json: { message: 'No user found' } }
  }

  return json({ user })
}

const schema = z.object({
  action: z.enum(['create-chat', 'block-user'])
})

type ActionInput = z.infer<typeof schema>

export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const username = params.username
  console.log(username, 'username')

  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'You must be logged in to create a chat')
    return redirect(`/login?redirect=/users/${params.username}`)
  }

  const { formData, errors } = await validateAction<ActionInput>({
    request,
    schema
  })

  if (errors) {
    setErrorMessage(session, `Invalid action: ${errors}`)
    return redirect(`/users/${params.username}`)
  }
  console.log(params.username, 'params.username')

  const { action } = formData

  switch (action) {
    case 'create-chat': {
      const currentUser = await prisma.user.findUnique({
        where: {
          username: params.username
        }
      })
      invariant(
        currentUser,
        'cannot create chat with a user that does not exist'
      )
      const existingChat = await prisma.chat.findFirst({
        where: {
          AND: [
            { users: { some: { id: user.id } } },
            { users: { some: { id: currentUser.id } } }
          ]
        },
        select: {
          id: true
        }
      })
      if (existingChat) {
        return redirect(`/chats/${existingChat.id}`)
      }
      const createdChat = await prisma.chat.create({
        select: {
          id: true
        },
        data: {
          users: {
            connect: [{ id: user.id }, { id: currentUser.id }]
          }
        }
      })
      return redirect(`/chats/${createdChat.id}`)
    }
    case 'block-user': {
      await prisma.block.update({
        where: {
          username: params.username
        },
        data: {
          blocked: true
        }
      })

      return redirect(`/users/${params.username}`)
    }

    default: {
      throw new Error(`Unsupported action: ${action}`)
    }
  }
}

export default function UserRoute() {
  const data = useLoaderData<{
    user: User & {
      chats: (Chat & {
        users: User
      })[]
    }
  }>()

  const loggedInUser = useOptionalUser()

  const isOwnProfile = loggedInUser?.id === data?.user?.id

  const oneOnOneChat = loggedInUser
    ? data.user?.chats.find(
        (c) =>
          // @ts-ignore
          c.users.length === 2 &&
          // @ts-ignore
          c.users.some(
            // @ts-ignore
            (u) => u.id === loggedInUser?.id || u.id === data?.user?.id
          )
      )
    : null

  return (
    <div>
      <h1>User</h1>
      <Outlet />
      <ul className='flex w-full flex-col items-center gap-1 md:gap-2'>
        <li className='flex w-full flex-row justify-between gap-1 rounded-lg border-2 p-1 md:gap-2 md:p-2'>
          <div className='flex flex-row items-center gap-1 md:gap-2'>
            <img
              className='h-10 w-10 rounded-full'
              src={data.user.avatarUrl || ''}
              alt='avatar'
            />
            <h3 className='text-xl font-bold'>{data.user.username}</h3>
          </div>
          <p>{data.user.email}</p>
          <RowBox>
            <Link to={`/users/${data.user.id}`}>View User</Link>
            <Form method='POST'>
              <Button
                variant='primary_filled'
                size='base'
                type='submit'
                name='action'
                value='block-user'
              >
                Block User
              </Button>
            </Form>
          </RowBox>
        </li>
      </ul>
      <strong>Chats:</strong>
      {isOwnProfile ? (
        <div>
          {data?.user?.chats.map((chat) => (
            <Link key={chat.id} to={`/chats/${chat.id}`}>
              Chat {chat.users.username}
            </Link>
          ))}
        </div>
      ) : oneOnOneChat ? (
        <Link to={`/chats/${oneOnOneChat.id}`}>Chat </Link>
      ) : (
        <>
          <Form method='POST'>
            <Button
              variant='primary_filled'
              size='base'
              type='submit'
              name='action'
              value='create-chat'
            >
              Create Chat
            </Button>
          </Form>
        </>
      )}
    </div>
  )
}
