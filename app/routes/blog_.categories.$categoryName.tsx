import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import BlogPreviewV2 from '~/components/v3-components/blog-ui/blog-post/blog-preview_v2'
import { getAllPostsV1WithFilter } from '~/server/post.server'

export async function loader({ request, params }: LoaderArgs) {
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
      <div className='flex w-full flex-col items-center gap-2'>
        {posts.map((post) => (
          <BlogPreviewV2 key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
