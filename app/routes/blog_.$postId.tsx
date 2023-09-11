import { ChevronLeftIcon } from '@radix-ui/react-icons'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import BlogCard from '~/components/v3-components/blog-ui/blog-post/blog-post-v2'
import { getSinglePostById } from '~/server/post.server'
import type { Post } from '~/server/schemas/schemas'

export async function loader({ params }: LoaderArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await getSinglePostById(postId)

  if (!post) {
    throw new Error('Post not found')
  }
  return json({ post: await getSinglePostById(postId) })
}
export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.post?.title },
    {
      name: data?.post?.description,
      content: data?.post?.content.substring(0, 160)
    }
  ]
}
export default function BlogPostRoute() {
  const data = useLoaderData<{
    post: Post
  }>()

  return (
    <div className='mx-auto h-full w-full items-center gap-4 overflow-auto'>
      {/* create a back button */}
      <NavLink
        title='Go Back'
        className='flex flex-row items-center gap-1'
        to='/blog'
      >
        <ChevronLeftIcon className='text-violet-400' />
        Back
      </NavLink>
      <div className='flex flex-col items-center gap-4'>
        <BlogCard post={data.post} />
      </div>
    </div>
  )
}
export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h1>Status:{error.status}</h1>
        <p>{error.data.message}</p>
      </div>
    )
  }
  let errorMessage = 'unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }
  return (
    <div>
      <h1>uh Oh..</h1>
      <p>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
