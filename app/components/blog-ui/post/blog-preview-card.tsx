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
import { Link, NavLink } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import { LucideArrowUpRightSquare } from 'lucide-react'
import { CommentPreview } from './blog-comments-count-container'
import { Badge } from '~/components/ui/badge'
import AvatarWithOptions from '~/components/avatar-with-options'

const BlogPreviewCard = ({ post }: { post: Omit<Post, 'comments'> }) => {
  const {
    title,
    description,
    content,
    published,
    id,
    userId,
    _count,
    categories
  } = post
  const { likes, favorites, user } = post

  return (
    <Card>
      <CardHeader className='p-4'>
        <div className='flex flex-row items-center justify-between w-full gap-2'>
          <CardTitle>{title}</CardTitle>
          <AvatarWithOptions user={user} />
        </div>
        <CardDescription className='indent-4'>{description}</CardDescription>
      </CardHeader>
      <CardContent
        className='w-full h-auto line-clamp-3 bg-secondary text-primary'
        dangerouslySetInnerHTML={{ __html: content }}
      ></CardContent>

      <CardFooter className='flex  flex-col items-start p-2'>
        <div className='flex flex-row flex-wrap gap-2'>
          {categories?.map((category) => (
            <Badge key={category.id} className='shrink' variant='default'>
              <NavLink to={`/blog?category=${category.value}`}>
                {category.label}
              </NavLink>
            </Badge>
          ))}
        </div>
        <div className='flex items-center justify-between w-full gap-2'>
          <LikeContainer postId={id} likes={likes} />
          <CommentPreview commentLength={_count?.comments} postId={id} />

          <FavoriteContainer postId={id} favorites={favorites} />
          <SharePostButton id={id} />
          <div className='flex flex-row items-center gap-2'></div>

          <div className='flex flex-row items-end gap-2'>
            <ReadMore postId={id} />
          </div>
        </div>
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
