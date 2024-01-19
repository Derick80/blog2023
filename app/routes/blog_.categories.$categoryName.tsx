import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { getAllPostsV1WithFilter } from '~/server/post.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { categoryName } = zx.parseParams(params, { categoryName: z.string() })

  if (!categoryName) {
    return json({ posts: [] })
  }

  const posts = await getAllPostsV1WithFilter(categoryName)

  return json({ posts })
}

export default function BlogRoute() {
  const params = useParams()
  const { categoryName } = params
  const { posts } = useLoaderData<typeof loader>()

  return (
    <div className='flex h-full  w-full flex-col items-center gap-4'>
      <h1>{categoryName}</h1>
      <div className='flex w-full flex-col items-center gap-2'></div>
    </div>
  )
}
