import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import { useLoaderData } from '@remix-run/react'
import type { Post } from '~/server/schemas/schemas'
import { BlogPreview } from './blog'
import CommentBox from '~/components/blog-ui/comments/comment-box'
import BlogCard from '~/components/blog-ui/blog-card'
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  const drafts = await prisma.post.findMany({
    where: {
      published: false,
      userId: user.id
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true,
      _count: {
        select: { likes: true, favorites: true, comments: true }
      }
    }
  })
  if (!drafts) {
    return { json: { message: 'No drafts found' } }
  }

  return json({ drafts })
}

export default function DraftsRoute() {
  const { drafts } = useLoaderData<{
    drafts: Post[]
  }>()
  return (
    <div className='flex flex-col gap-2'>
      {drafts.map((draft: Post) => (
        <>
          <BlogPreview key={draft.id} post={draft} />
          <BlogCard post={draft}>
            <CommentBox postId={draft.id} />
          </BlogCard>
        </>
      ))}
    </div>
  )
}
