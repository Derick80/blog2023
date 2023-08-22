import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { zx } from 'zodix'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'

// or cloudflare/deno

export async function loader({ request, params }: LoaderArgs) {
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
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You need to be authenticated to like a post')
  }
  const { postId } = zx.parseParams(params, { postId: z.string() })

  const userId = user.id

  if (!userId || !postId) {
    return json(
      { error: 'invalid form data bad userId or PostId like' },
      { status: 400 }
    )
  }

  console.log(request.method, 'request method')

  try {
    if (request.method === 'POST') {
      return await prisma.like.create({
        data: {
          postId,
          userId
        }
      })
    }

    if (request.method === 'DELETE') {
      return await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
    }

    return json({ message: 'like created or deleted successfully' })
  } catch (error) {
    return json({ error: 'invalid form data like' }, { status: 400 })
  }
}
