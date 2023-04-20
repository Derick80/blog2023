import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/auth/prisma.server'
import { BlogPreview } from './blog'

export async function loader({ request, params }: LoaderArgs) {
  const { categoryName } = params
  if (!categoryName) {
    return json({ posts: [] })
  }
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: {
        some: {
          value: categoryName
        }
      }
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true
    }
  })

  return json({ posts })
}

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <div className='flex h-screen w-full flex-col items-center gap-4 border-2'>
      {posts.map((post) => (
        <BlogPreview key={post.id} post={post} />
      ))}
    </div>
  )
}
