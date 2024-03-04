import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import ImageController from '~/components/images/image-controller'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getImages } from '~/server/cloudinary.server'
import { prisma } from '~/server/prisma.server'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('Not authenticated')
  }



  return json({ user,})
}

export default function Beta () {

  const { user } = useLoaderData<typeof loader>()


  return (
    <div className='flex flex-col items-center  w-full h-full space-y-4'>
      <h1>Post</h1>
    </div>
  )
}
