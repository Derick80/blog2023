import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/auth/prisma.server'
import BlogCard from '~/components/blog-ui/blog-card'
import CommentBox from '~/components/blog-ui/comments/comment-box'
import { useMatchesData } from '~/utilities'

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
      categories: true,
      comments: {
        include: {
          user: true,
          children: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })

  return json({ posts })
}

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>()
  console.log(posts.length, 'posts')

  const parentData = useMatchesData('/blog')
  console.log(parentData, 'parentData')

  return (
    <div className='flex h-screen w-full flex-col items-center gap-4'>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post}>
          <CommentBox postId={post.id} />
        </BlogCard>
      ))}
    </div>
  )
}
