import { ChevronLeftIcon } from '@radix-ui/react-icons'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import BlogCard from '~/components/v2-components/blog-ui/blog-post/blog-post-v2'
import { DefaultUserSelect } from '~/server/post.server'
import { prisma } from '~/server/prisma.server'
import type { Comment, Post } from '~/server/schemas/schemas'

export async function loader({ params }: LoaderFunctionArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      categories: true,
      likes: true,
      favorites: true,
      _count: {
        select: {
          comments: true,
          likes: true
        }
      }
    }
  })

  if (!post) {
    throw new Error('Post not found')
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId
    },
    include: {
      user: {
        select: DefaultUserSelect
      },
      likes: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  console.log(comments, 'comments from loader')

  return json({ post, comments })
}
export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
    comments: Comment[]
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
        <BlogCard post={data.post} comments={data.comments} />
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
        <h2>Status:{error.status}</h2>
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
      <p className='scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl'>
        uh Oh..
      </p>
      <p>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
