import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { prisma } from '~/server/auth/prisma.server'
import { validateAction } from '~/utilities'
import {
  commitSession,
  getSession,
  setErrorMessage
} from '~/server/auth/session.server'

export async function loader({ request, params }: LoaderArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })

  const comments = await prisma.comment.findMany({
    where: {
      postId
    },
    include: {
      user: true
    }
  })

  return json({ comments })
}
export const schema = z.object({
  parentId: z.string().optional(),
  message: z.string().min(1).max(1000)
})

export type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }
  const session = await getSession(request.headers.get('Cookie'))

  const { postId } = zx.parseParams(params, { postId: z.string() })

  const { formData, errors } = await validateAction({ request, schema })

  if (errors) {
    return json({ errors })
  }

  const { message, parentId } = formData as ActionInput

  const comment = await prisma.comment.create({
    data: {
      message,
      user: {
        connect: {
          id: user.id
        }
      },
      ...(parentId && {
        parent: {
          connect: {
            id: parentId
          }
        }
      }),
      post: {
        connect: {
          id: postId
        }
      },
      createdBy: user.username
    }
  })

  if (!comment) {
    setErrorMessage(session, 'Something went wrong')
  } else {
    setErrorMessage(session, 'Comment posted')
  }

  return redirect(`/blog`, {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}
