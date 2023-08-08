import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import {
  getInitialPosts,
  getPosts,
  getPostsVersionTwo
} from '~/server/post.server'
import { useLoaderData } from '@remix-run/react'
import { GetPostsVersionTwoType } from '~/server/schemas/schemas'

// export async function action({ request, params }: ActionArgs) {
//   const formData = await request.formData()

//   return json({ message: 'success' })
// }

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const posts = await getPostsVersionTwo()

  // const posts = await getInitialPosts()
  return json({ posts })
}

export default function BetaRoute() {
  const data = useLoaderData<{ posts: GetPostsVersionTwoType[] }>()

  return (
    <div className='flex flex-col items-center gap-1 md:gap-2 lg:gap-3'></div>
  )
}
