import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import BlogCard from '~/components/blog-ui/blog-card'
import CommentBox from '~/components/blog-ui/comments/comment-box'
import { prisma } from '~/server/auth/prisma.server'
import type { Post } from '~/server/schemas/schemas'

export async function loader({ params }: LoaderArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true
    }
  })
  if (!post) {
    return json({ message: 'Post not found' }, { status: 404 })
  }
  return json({ post })
}

export default function BlogPostRoute() {
  const data = useLoaderData<{
    post: Post
  }>()

  return (
    <div className='mx-auto h-full w-full items-center gap-4 overflow-auto'>
      <h1>Blog</h1>
      <div className='flex flex-col items-center gap-4'>
        <BlogCard post={data?.post}>
          <CommentBox postId={data.post.id} />
        </BlogCard>
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
      <h1 className='text-2xl font-bold'>uh Oh..</h1>
      <p className='text-xl'>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
