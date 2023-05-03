import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { zx } from 'zodix'
import { prisma } from '~/server/auth/prisma.server'
import { z } from 'zod'
import { validateAction } from '~/utilities'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'

export async function loader({ request, params }: LoaderArgs) {
  const { commentId } = zx.parseParams(params, { commentId: z.string() })

  const comments = await prisma.comment.findMany({
    where: {
      parentId: commentId
    },

    include: {
      user: true,
      likes: true
    }
  })

  return json({ comments })
}

const schema = z.object({
  action: z.string().optional(),
  message: z.string().optional(),
  userId: z.string().optional()
})

export type ActionData = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  console.log(params, 'params')

  const { commentId } = zx.parseParams(params, { commentId: z.string() })
  console.log(commentId, 'commentId')
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId
    },
    include: {
      likes: true,
      user: true
    }
  })

  const isLiked = comment?.likes.find(
    (like) => like.userId === comment?.user.id
  )
    ? true
    : false

  const { formData, errors } = await validateAction({ request, schema })

  if (errors) {
    return json({ errors })
  }

  const { message, action, userId } = formData as ActionData
  console.log(userId, 'userId')

  switch (action) {
    case 'edit':
      const updated = await prisma.comment.update({
        where: {
          id: commentId
        },
        data: {
          message
        }
      })
      if (!updated) {
        setErrorMessage(session, 'Something went wrong')
      } else {
        setSuccessMessage(session, 'Comment updated')
      }
      return json(
        {
          message: 'success'
        },
        {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        }
      )
    case 'delete':
      const deleted = await prisma.comment.delete({
        where: {
          id: commentId
        }
      })
      if (!deleted) {
        setErrorMessage(session, 'Something went wrong')
      } else {
        setSuccessMessage(session, 'Comment deleted')
      }

      return json(
        { message: 'success' },
        {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        }
      )
    default:
      break
  }

  return json({ message: 'success' })
}
