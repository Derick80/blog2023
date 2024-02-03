import FavoriteContainer from '~/components/blog-ui/post/favorite-container'
import { SharePostButton } from '~/components/blog-ui/post/share-button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '~/components/ui/card'
import { Caption } from '~/components/ui/typography'
import { Post } from '~/server/schemas/schemas'
import LikeContainer from '../like-container'
import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import { LucideArrowUpRightSquare } from 'lucide-react'
import { CommentPreview } from './blog-comments-count-container'

const BlogPreviewCard = ({ post }: { post: Omit<Post, 'comments'> }) => {
  const user = useOptionalUser()
  const isAdmin = user?.role !== 'ADMIN'

  const { title, description, content, published, id, userId, _count } = post
  const { likes, favorites } = post

  const isOwner = user?.id === userId

  const canEdit = isAdmin ? true : isOwner ? true : false

  return (
    <Card className=''>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardFooter className='items-center  flex justify-between p-2'>
        <LikeContainer postId={id} likes={likes} />
        <CommentPreview commentLength={_count?.comments} postId={id} />

        <FavoriteContainer postId={id} favorites={favorites} />
        <SharePostButton id={id} />
        <div className='flex flex-row items-center gap-2'></div>

        <div className='flex flex-row items-end gap-2'>
          <ReadMore postId={id} />
        </div>
      </CardFooter>
    </Card>
  )
}

function ReadMore({ postId }: { postId: string }) {
  return (
    <Link
      className='flex items-center gap-2'
      to={`/blog/${postId}`}
      prefetch='intent'
    >
      <Caption className='hidden md:block'>Read More</Caption>
      <LucideArrowUpRightSquare                  className='text-primary md:size-6 size-4'
 />
    </Link>
  )
}

export default BlogPreviewCard
