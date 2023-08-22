import { ChevronLeftIcon } from '@radix-ui/react-icons'
import type { LoaderArgs } from '@remix-run/node'
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
import { prisma } from '~/server/prisma.server'
import type { Post } from '~/server/schemas/schemas'

export async function loader({ params }: LoaderArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          role: true
        }
      },
      likes: true,
      favorites: true,
      categories: true,
      comments: {
        include: {
          _count: true,
          likes: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatarUrl: true
            }
          },
          children: {
            include: {
              user: true,
              likes: true,
              children: true
            }
          }
        }
      }
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
  console.log(data, 'data from blog post id route')

  return (
    <div className='mx-auto h-full w-full items-center gap-4 overflow-auto'>
      {/* create a back button */}
      <NavLink className='flex flex-row items-center gap-1' to='/blog'>
        <ChevronLeftIcon />
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
      <h1 className='text-2xl font-bold'>uh Oh..</h1>
      <p className='text-xl'>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
