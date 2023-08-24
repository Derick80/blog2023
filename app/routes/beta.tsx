// export async function action({ request, params }: ActionArgs) {
//   const formData = await request.formData()

import { LoaderArgs } from '@remix-run/node'
import { redirect } from 'remix-typedjson'
import { json } from 'zod-form-data'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getPostsVersionTwo } from '~/server/post.server'

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

export default function Beta() {
  return (
    <div className='grid grid-cols-4 place-items-center gap-x-8 gap-y-10 px-2.5 pt-12 md:grid-cols-8 md:px-0'></div>
  )
}
