import FavoriteContainer from '~/components/blog-ui/post/favorite-container'
import { SharePostButton } from '~/components/blog-ui/post/share-button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent
} from '~/components/ui/card'
import { Caption } from '~/components/ui/typography'
import { Post } from '~/server/schemas/schemas'
import LikeContainer from '../like-container'
import { Await, Link, NavLink, useLoaderData } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import { LucideArrowUpRightSquare } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import AvatarWithOptions from '~/components/avatar-with-options'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { CommentHeader, Comments } from './comments/comment'
import { Suspense } from 'react'
import { Loading } from '~/components/loading'
import { loader } from '~/routes/blog_.$postId'

const BlogPreviewCard = ({ post }: { post: Omit<Post, 'comments'> }) => {
  const user = useOptionalUser()
  console.log(user, 'user')

  const isOwner = user?.id === post?.userId
  console.log(isOwner, 'isOwner')
  return (
    <Card>
      <CardHeader className='p-4'>
        <div className='flex flex-row items-center justify-between w-full gap-2'>
          <CardTitle>{post.title}</CardTitle>
          <AvatarWithOptions user={post.user} />
        </div>
        <CardDescription className='indent-4'>
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardContent
        className='w-full h-auto line-clamp-3 bg-card text-primary'
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></CardContent>

      <CardFooter className='flex  flex-col items-start p-2'>
        <div className='flex flex-row flex-wrap gap-2'>
          {post.categories?.map((category) => (
            <Badge key={category.id} className='shrink' variant='default'>
              <NavLink to={`/blog?category=${category.value}`}>
                {category.label}
              </NavLink>
            </Badge>
          ))}
        </div>
        <div className='flex items-center justify-between w-full gap-2'>
          <LikeContainer postId={post.id} likes={post.likes} />

          <FavoriteContainer postId={post.id} favorites={post.favorites} />
          <SharePostButton id={post.id} />

          <div className='flex flex-row items-end gap-2'>
            {isOwner ? (
              <Link
                className='flex items-center gap-2'
                to={`/blog/drafts/${post.id}`}
                prefetch='intent'
              >
                <Caption className='hidden md:block'>Edit</Caption>
                <Pencil2Icon className='text-primary md:size-6 size-4' />
              </Link>
            ) : (
              <Link
                className='flex items-center gap-2'
                to={`/blog/${post.id}`}
                prefetch='intent'
              >
                <Caption className='hidden md:block'>Read More</Caption>
                <LucideArrowUpRightSquare className='text-primary md:size-6 size-4' />
              </Link>
            )}
          </div>
        </div>
        <CommentHeader totalComments={post._count?.comments} />
        {/* <Suspense fallback={<Loading />}>
          <Await resolve={comments}>
            {(comments) => <Comments comments={comments} />}
          </Await>
        </Suspense> */}
      </CardFooter>
    </Card>
  )
}

export function ReadMore({ postId }: { postId: string }) {
  return (
    <Link
      className='flex items-center gap-2'
      to={`/blog/${postId}`}
      prefetch='intent'
    >
      <Caption className='hidden md:block'>Read More</Caption>
      <LucideArrowUpRightSquare className='text-primary md:size-6 size-4' />
    </Link>
  )
}

export default BlogPreviewCard
