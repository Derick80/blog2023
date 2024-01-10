// export async function action({ request, params }: ActionFunctionArgs) {
//   const formData = await request.formData()

import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getPostsVersionTwo } from '~/server/post.server'
import React, { useContext } from 'react'
import { useLoaderData } from '@remix-run/react'
//   return json({ message: 'success' })
// }

export async function loader ({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const posts = await getPostsVersionTwo()

  // const posts = await getInitialPosts()
  return json({ posts })
}

export default function Beta () {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <div className='grid grid-cols-4 place-items-center gap-x-8 gap-y-10 px-2.5 pt-12 md:grid-cols-8 md:px-0'></div>
  )
}
