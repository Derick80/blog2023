import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
  useRouteLoaderData
} from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import type { Post } from '~/server/schemas/schemas'

export async function loader({ request, params }: LoaderArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })

  return json({})
}

export default function BlogPostRoute() {
  const data = useLoaderData<typeof loader>()
  const params = useParams()

  const matches = useRouteLoaderData('routes/blog') as {
    posts: Post[]
  }

  const match = matches?.posts.find(
    (match) => match.id === params.postId
  ) as Post
  console.log(match, 'match')

  return (
    <div className='mx-auto h-full w-full items-center gap-4 overflow-auto border-2'>
      <h1>Blog</h1>
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-4xl font-semibold'>{match.title}</h1>
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
