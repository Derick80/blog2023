import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import {
  setErrorMessage,
  setSuccessMessage,
  commitSession,
  getSession
} from '~/server/session.server'
import { validateAction } from '~/utilities'

const editPostSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('setPrimaryImage'),
    postId: z.string(),
    imageUrl: z.string().url('Image URL should be a valid URL')
  })
])

type ActionInput = z.infer<typeof editPostSchema>
export async function action({ request, params }: ActionFunctionArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
  const { formData, errors } = await validateAction({
    request,
    schema: editPostSchema
  })

  if (errors) {
    return json({ errors }, { status: 422 })
  }

  const { intent } = formData as ActionInput

  if (intent === 'setPrimaryImage') {
    const { imageUrl } = formData as ActionInput
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        imageUrl
      }
    })
    if (!post) {
      setErrorMessage(session, 'Post not updated')
    } else {
      setSuccessMessage(session, `Post ${post.title} updated`)
      return redirect(`/`, {
        headers: {
          'Set-Cookie': await commitSession(session)
        }
      })
    }
  }
}
