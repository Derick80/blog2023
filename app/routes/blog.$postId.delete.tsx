import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'

export async function action({ request, params }: ActionArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  if (!postId) {
    throw new Error('Post id is required')
  }

  const user = await isAuthenticated(request)
  const session = await getSession(request.headers.get('Cookie'))

  if (!user) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  const post = await prisma.post.delete({
    where: {
      id: postId
    }
  })

  if (!post) {
    setErrorMessage(session, 'Could not delete post')
  } else {
    setSuccessMessage(session, `Post ${post.title} deleted`)
  }

  return redirect('/blog', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}
