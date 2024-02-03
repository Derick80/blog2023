import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getSession } from '~/server/session.server'

// This route is a catch-all for actions that are related to a post. This might be better described as a route that takes in a users intent and performs that intent on the chosen post.

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('favorite-post'),
    postId: z.string()
  }),
  z.object({
    intent: z.literal('like-post'),
    postId: z.string()
  }),
  z.object({
    intent: z.literal('like-comment'),
    postId: z.string()
  })
])
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You need to be authenticated to favorite a post')
  }

  return json({ success: true })
}
