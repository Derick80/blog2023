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

  const userId = user.id
  const { postId } = zx.parseParams(params, { postId: z.string() })

  if (!userId || !postId) {
    return json(
      { error: 'invalid form data bad userId or PostId favorite' },
      { status: 400 }
    )
  }

  console.log(request.method, 'request method')

  try {
    if (request.method === 'POST') {
      return await prisma.favorite.create({
        data: {
          postId,
          userId
        }
      })
    }
    if (request.method === 'DELETE') {
      return await prisma.favorite.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
    }
    return json({ message: 'success' })
  } catch (error) {
    return json({ error: 'invalid data' }, { status: 400 })
  }
}
