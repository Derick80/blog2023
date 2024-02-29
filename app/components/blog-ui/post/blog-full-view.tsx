import { Post } from '~/server/schemas/schemas'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Await, NavLink, useLoaderData } from '@remix-run/react'
import LikeContainer from '../like-container'
import FavoriteContainer from './favorite-container'
import { SharePostButton } from './share-button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { LoggedIn } from '~/components/logged-in'
import { LoggedOut } from './logged-out'
import { CommentHeader, Comments } from './comments/comment'
import { Suspense } from 'react'
import { Loading } from '~/components/loading'
import { loader } from '~/routes/blog_.$postId'

type BlogFullViewProps = {
  post: Post
}

const BlogFullView = () => {

    const {post,comments} = useLoaderData<typeof loader>()

  return (
    <Card className='w-full h-auto  '>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      {/* <CardContent
                className='w-full h-auto bg-secondary text-primary'
                dangerouslySetInnerHTML={ { __html: content } }
            ></CardContent> */}
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
        </div>
        <LoggedIn>
         <CommentHeader totalComments={ post._count?.comments } />
         <Suspense fallback={<Loading />}>
               <Await resolve={comments}>
                  {(comments) => <Comments comments={comments} />}
               </Await>
            </Suspense>
        </LoggedIn>
        <LoggedOut>
            log in to comment
        </LoggedOut>

        <ScrollArea className='w-full '>
        </ScrollArea>
      </CardFooter>
    </Card>
  )
}

export default BlogFullView
