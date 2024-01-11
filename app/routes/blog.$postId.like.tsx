import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'

// or cloudflare/deno

export async function loader ({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)

  if (!user) {
    throw new Error('You need to be authenticated to like a post')
  }
  const postId = params.postId
  if (!postId) {
    throw new Error('You need to provide a postId to like a post')
  }

  return json({ user })
}

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'))

  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You need to be authenticated to like a post')
  }
  const { postId } = zx.parseParams(params, {
    postId: z.string(

    )
  })

  const userId = user.id

  if (!userId || !postId) {
    return json(
      { error: 'invalid form data bad userId or PostId like' },
      { status: 400 }
    )
  }

  try {
    if (request.method === 'POST') {
      const liked = await prisma.like.create({
        data: {
          postId,
          userId
        }
      })
      if (!liked) throw new Error('could not like post')
      if (liked) {
        setSuccessMessage(session, 'liked')
      }
    }

    if (request.method === 'DELETE') {
      const unliked = await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
      if (!unliked) throw new Error('could not delete like')
      if (unliked) {
        setErrorMessage(session, 'unliked')
      }
    }

    return new Response(null, {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  } catch (error) {
    return json({ error: 'invalid form data like' }, { status: 400 })
  }
}
