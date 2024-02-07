import { Post } from '~/server/schemas/schemas'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { NavLink } from '@remix-run/react'
import LikeContainer from '../like-container'
import { CommentPreview } from './blog-comments-count-container'
import FavoriteContainer from './favorite-container'
import { SharePostButton } from './share-button'
import CreateCommentForm from './comments/create-comment-form'
import CommentList from './comments/list-comments'
import { ScrollArea } from '~/components/ui/scroll-area'

type BlogFullViewProps = {
  post: Post
}

const BlogFullView = ({ post }: BlogFullViewProps) => {
  const {
    title,
    description,
    content,
    published,
    id,
    userId,
    _count,
    categories,
    likes,
    favorites,
    user,
    imageUrl,
    postImages,
    comments
  } = post



  return (


    <Card className='w-full h-auto  '>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {/* <CardContent
                className='w-full h-auto bg-secondary text-primary'
                dangerouslySetInnerHTML={ { __html: content } }
            ></CardContent> */}
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
        </div>
        <CreateCommentForm
         />

        <ScrollArea className='w-full '>
          {post._count.comments > 0 && <CommentList />}
        </ScrollArea>
      </CardFooter>
    </Card>
  )
}

export default BlogFullView
