import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { Post } from '~/server/schemas/schemas'
import { getAllUserDraftsV1 } from '~/server/post.server'
import BlogPreviewV2 from '~/components/v3-components/blog-ui/blog-post/blog-preview_v2'
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  return json({ drafts: await getAllUserDraftsV1(user.id) })
}

export default function DraftsRoute() {
  const { drafts } = useLoaderData<{
    drafts: Post[]
  }>()
  return (
    <div className='flex w-full flex-col items-center gap-2'>
      {drafts.map((post) => (
        <BlogPreviewV2 key={post.id} post={post} />
      ))}
    </div>
  )
}
