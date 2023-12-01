import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { prisma } from '~/server/prisma.server'
import { DefaultUserSelect } from '~/server/post.server'
import { zx } from 'zodix'
import { z } from 'zod'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }

  const { postId } = zx.parseParams(params, {
    postId: z.string()
  })

  const postComments = await prisma.comment.findMany({
    where: {
      postId
    },
    include: {
      user: {
        select: DefaultUserSelect
      }
    }
  })

  return json({ postComments })
}

export async function action({ request }: ActionFunctionArgs) {
  return json({ success: true })
}
