import type { ActionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/prisma.server'
export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }
  const userId = user.id

  const { commentId } = zx.parseParams(params, { commentId: z.string() })

  if (!userId || !commentId) {
    return json(
      { error: 'invalid form data bad userId or commentId like' },
      { status: 400 }
    )
  }

  try {
    if (request.method === 'POST') {
      await prisma.commentLike.create({
        data: {
          user: {
            connect: {
              id: userId
            }
          },

          comment: {
            connect: {
              id: commentId
            }
          }
        }
      })
    }

    if (request.method === 'DELETE') {
      await prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId
          }
        }
      })
    }
  } catch (error) {
    console.log(error, 'error')
  }

  return json({ user })
}
