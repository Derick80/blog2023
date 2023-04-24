import { LoaderArgs, redirect } from '@remix-run/node'
import { eventStream } from 'remix-utils'
import { z } from 'zod'
import { zx } from 'zodix'
import { isAuthenticated } from '~/server/auth/auth.server'
import { chatEmitter, EVENTS } from '~/server/auth/chat.server'
import { prisma } from '~/server/auth/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
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
  return eventStream(request.signal, (send) => {
    function handler(message: string) {
      send('message', message)
    }
    chatEmitter.addListener(EVENTS.NEW_MESSAGE, handler)
    return () => {
      chatEmitter.removeListener(EVENTS.NEW_MESSAGE, handler)
    }
  })
}

// export function unstable_shouldReload(){
//     // this should never reload
//     return false
// }
