import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'
import BlogPreviewV2 from '~/components/v2-components/blog-ui/blog-post/blog-preview_v2'
import { getAllPostsV1 } from '~/server/post.server'
import { FullPost } from '~/server/schemas/schemas_v2'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const posts = await getAllPostsV1()
  if (!posts) throw new Error('No posts found')
  return json({ posts })
}

export default function OmegaIndex() {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col gap-2'>
      {posts.map((post) => (
        <BlogPreviewV2 key={post.id} post={post} />
      ))}
    </div>
  )
}
