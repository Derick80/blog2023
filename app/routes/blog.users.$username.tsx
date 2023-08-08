import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { getUserPosts } from '~/server/post.server'
export async function loader({ request, params }: LoaderArgs) {
  const { username } = zx.parseParams(params, { username: z.string() })

  const userPosts = await getUserPosts(username)
  console.log(userPosts.length, 'userPosts')

  if (!userPosts) {
    return json({ message: 'No user found' }, { status: 404 })
  }

  return json({ userPosts })
}
