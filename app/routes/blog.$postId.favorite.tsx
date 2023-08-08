import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
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

export async function loader({ request, params }: LoaderArgs) {
  throw new Response("This page doesn't exists.", { status: 404 })
}

export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You need to be authenticated to favorite a post')
  }
  // get the session from the request for toast messages
  const session = await getSession(request.headers.get('Cookie'))

  const userId = user.id
  const { postId } = zx.parseParams(params, { postId: z.string() })

  if (!userId || !postId) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  if (request.method === 'POST') {
    const liked = await prisma.favorite.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: postId
          }
        }
      }
    })

    if (!liked) {
      setErrorMessage(session, `You can't favorite this post`)
    } else {
      setSuccessMessage(session, `You favorited this post`)
    }
  }

  if (request.method === 'DELETE') {
    const favorite = await prisma.favorite.delete({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    })

    if (!favorite) {
      setErrorMessage(session, `You can't unfavorite this post`)
    } else {
      setSuccessMessage(session, `You unfavorited this post`)
    }
  }

  return json(
    { message: 'ok' },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  )
}
