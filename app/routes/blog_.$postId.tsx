import { LoaderArgs, json } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { prisma } from '~/server/auth/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true
    }
  })

  return json({ post })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className='mx-auto h-full w-full items-center gap-4 overflow-auto border-2'>
      <h1>Blog</h1>
      <summary>
        <details>
          <pre className='flex w-full flex-col flex-wrap items-center justify-center border-2'>
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </details>
      </summary>
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
