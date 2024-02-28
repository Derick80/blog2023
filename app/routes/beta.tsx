import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import ImageController from '~/components/images/image-controller'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('Not authenticated')
  }

  const post = await prisma.post.findUnique({
    where: {
      id: 'clt5bdm5o0000l3jq5toua30r'
    },
    include: {
      postImages: true
    }
  })
  if (!post) {
    throw new Error('No post found')
  }

  return json({ user, post })
}

export default function Beta() {
  const { user, post } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col items-center  w-full h-full space-y-4'>
      <h1>Post</h1>
      <ImageController post={post} />
    </div>
  )
}
