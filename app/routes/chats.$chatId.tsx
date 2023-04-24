import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useParams,
  useRevalidator
} from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { useEventSource } from 'remix-utils'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { zx } from 'zodix'
import Button from '~/components/button'
import { isAuthenticated } from '~/server/auth/auth.server'
import { EVENTS, chatEmitter } from '~/server/auth/chat.server'
import { prisma } from '~/server/auth/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'
import { validateAction } from '~/utilities'

export async function loader({ request, params }: LoaderArgs) {
  const { chatId } = zx.parseParams(params, { chatId: z.string() })
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  const userId = user.id
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
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
          avatarUrl: true
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

  if (!chat) {
    throw new Response('Chat not found', { status: 404 })
  }
  return json({ chat, timestamp: Date.now() })
}
const schema = z.object({
  action: z.string(),
  content: z.string().min(1, 'Message must be at least 1 character long')
})

type ActionInput = z.infer<typeof schema>

export async function action({ request, params }: ActionArgs) {
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

  const chatId = zx.parseParams(params, { chatId: z.string() }).chatId

  if (!chatId) {
    setErrorMessage(session, 'Chat not found')
    return redirect('/chats', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  const userId = user.id

  const { formData, errors } = await validateAction({ request, schema })

  if (errors) {
    setErrorMessage(session, 'Invalid form data')
    return json({ errors }, { status: 422 })
  }

  const { action, content } = formData as ActionInput
  switch (action) {
    case 'send-message': {
      const sent = await prisma.message.create({
        data: {
          content,
          userId,
          chatId: chatId
        },
        select: {
          id: true
        }
      })

      if (!sent) {
        setErrorMessage(session, 'Failed to send message')
      } else {
        setSuccessMessage(session, 'Message sent')
      }

      chatEmitter.emit(EVENTS.NEW_MESSAGE, { timestamp: Date.now() })
      return json(
        { success: true },
        {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        }
      )
    }
    default: {
      throw new Error(`Unexpected action: ${action}`)
    }
  }
}
export default function ChatRoute() {
  const { chatId } = useParams()
  const actionData = useActionData<typeof action>()
  const data = useLoaderData<typeof loader>()
  const messageFetcher = useFetcher<typeof action>()
  const chatUpdateData = useEventSource(`/chats/${chatId}/events`)
  const revalidator = useRevalidator()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    revalidator.revalidate()
  }, [chatUpdateData])
  const messages = [...data.chat.messages]
  console.log(messages, 'messages')

  return (
    <div className='items- mb-10 flex h-screen w-full flex-col overflow-auto border-2'>
      <h1>Chat</h1>

      <div className='flex flex-col gap-2 text-xs'>
        {messages.map((message) => {
          const sender = data.chat.users.find(
            (user) => user.id === message.userId
          )
          return (
            <div key={message.id} className='flex flex-row gap-2'>
              <img
                src={sender?.avatarUrl ?? ''}
                alt={''}
                className='h-8 w-8 rounded-full'
              />
              <div className='flex flex-col'>
                <div className='flex flex-row'>
                  <div className='font-bold'>{sender?.username}</div>
                </div>
                <div>{message.content}</div>
              </div>
            </div>
          )
        })}
      </div>
      <hr />
      <messageFetcher.Form
        method='post'
        onSubmit={(event) => {
          const form = event.currentTarget
          requestAnimationFrame(() => {
            form.reset()
          })
        }}
      >
        <input
          type='text'
          name='content'
          className='w-full rounded-xl border-2 text-black'
        />
        {actionData?.errors?.content && (
          <div className='text-red-500'>{actionData.errors.content}</div>
        )}

        <Button
          variant='primary_filled'
          type='submit'
          name='action'
          value='send-message'
        >
          Send
        </Button>
      </messageFetcher.Form>
    </div>
  )
}
