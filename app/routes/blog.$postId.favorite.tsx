import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
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

export async function loader () {
  throw new Error("This page doesn't exists.")
}

export async function action ({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You need to be authenticated to favorite a post')
  }
  // get the session from the request for toast messages

  const userId = user.id
  const { postId } = zx.parseParams(params, { postId: z.string() })

  if (!userId || !postId) {
    return json(
      { error: 'invalid form data bad userId or PostId favorite' },
      { status: 400 }
    )
  }

  try {
    if (request.method === 'POST') {
      const _favorited = await prisma.favorite.create({
        data: {
          postId,
          userId
        }
      })
      if (!_favorited) throw new Error('could not favorite post')
      if (_favorited) {
        setSuccessMessage(session, 'favorited')
      }
    }
    if (request.method === 'DELETE') {
      const _deleted = await prisma.favorite.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
      if (!_deleted) throw new Error('could not delete favorite')
      if (_deleted) {
        setErrorMessage(session, 'unfavorited')
      }
    }

    return new Response(null, {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  } catch (error) {
    return json({ error: 'invalid data' }, { status: 400 })
  }
}
