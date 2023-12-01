import { Message } from '@prisma/client'
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { eventStream } from 'remix-utils/sse/server'
import { z } from 'zod'
import { zx } from 'zodix'
import { isAuthenticated } from '~/server/auth/auth.server'
import { chatEmitter, EVENTS } from '~/server/chat.server'
import { prisma } from '~/server/prisma.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await isAuthenticated(request)

  if (!currentUser) return redirect('/login')
  const { chatId } = zx.parseParams(params, { chatId: z.string() })

  const userId = currentUser.id
  const hasAccess = await prisma.chat.findFirst({
    where: {
      id: chatId,
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

  if (!hasAccess) {
    return new Response('Access Denied', { status: 403 })
  }
  return eventStream(request.signal, function setup(send) {
    function listener(message: Message) {
      send({ event: 'new-message', data: message.id })
    }
    chatEmitter.addListener('message', listener)
    return () => {
      chatEmitter.removeListener('message', listener)
    }
  })
}

// export function unstable_shouldReload(){
//     // this should never reload
//     return false
// }
