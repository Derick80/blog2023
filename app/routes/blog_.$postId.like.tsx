import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'

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
  invariant(user, 'need  user')
  const postId = params.postId
  const userId = user.id

  if (!userId || !postId) {
    return json(
      { error: 'invalid form data bad userId or PostId like' },
      { status: 400 }
    )
  }
  try {
    if (request.method === 'POST') {
      await prisma.like.create({
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
    }

    if (request.method === 'DELETE') {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      })
    }

    return json({ success: true })
  } catch (error) {
    return json({ error: 'invalid form data like' }, { status: 400 })
  }
}
